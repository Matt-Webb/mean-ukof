'use strict';

var _ = require('lodash'),
    config = require('../config'),
    mongoose = require('mongoose'),
    chalk = require('chalk'),
    crypto = require('crypto');

// global seed options object
var seedOptions = {};

function removeUser(user) {
    return new Promise(function(resolve, reject) {
        var User = mongoose.model('User');
        User.find({
            username: user.username
        }).remove(function(err) {
            if (err) {
                reject(new Error('Failed to remove local ' + user.username));
            }
            resolve();
        });
    });
}

function saveUser(user) {
    return function() {
        return new Promise(function(resolve, reject) {
            // Then save the user
            user.save(function(err, theuser) {
                if (err) {
                    reject(new Error('Failed to add local ' + user.username));
                } else {
                    resolve(theuser);
                }
            });
        });
    };
}

function checkUserNotExists(user) {
    return new Promise(function(resolve, reject) {
        var User = mongoose.model('User');
        User.find({
            username: user.username
        }, function(err, users) {
            if (err) {
                reject(new Error('Failed to find local account ' + user.username));
            }

            if (users.length === 0) {
                resolve();
            } else {
                reject(new Error('Failed due to local account already exists: ' + user.username));
            }
        });
    });
}

function reportSuccess(password) {
    return function(user) {
        return new Promise(function(resolve, reject) {
            if (seedOptions.logResults) {
                console.log(chalk.bold.red('Database Seeding:\t\t\tLocal ' + user.username + ' added with password set to ' + password));
            }
            resolve();
        });
    };
}

// save the specified user with the password provided from the resolved promise
function seedTheUser(user) {
    return function(password) {
        return new Promise(function(resolve, reject) {

            var User = mongoose.model('User');
            // set the new password
            user.password = password;

            if (user.username === seedOptions.seedAdmin.username && process.env.NODE_ENV === 'production') {
                checkUserNotExists(user)
                    .then(saveUser(user))
                    .then(reportSuccess(password))
                    .then(function() {
                        resolve();
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            } else {
                removeUser(user)
                    .then(saveUser(user))
                    .then(reportSuccess(password))
                    .then(function() {
                        resolve();
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            }
        });
    };
}

// report the error
function reportError(reject) {
    return function(err) {
        if (seedOptions.logResults) {
            console.log();
            console.log('Database Seeding:\t\t\t' + err);
            console.log();
        }
        reject(err);
    };
}

function seedArticles() {
    var Article = mongoose.model('Article');

    if(Article.count(function(err, count) {

        if(!err && count === 0) {
            var articles = require('../../data/articles.json');

            if(articles) {
                Article.collection.insert(articles, onInsert);
                console.log(chalk.green('New Articles added'), count);
            } else {
                console.log(chalk.red('There was an error retreiving the articles data'));
            }

        } else if (err) {
            console.log(chalk.red('Articles error'), err);
        } else {
            console.log(chalk.yellow('Articles have already been added'), count);
        }

    }));
}

function seedInstructors() {

    var Instructor = mongoose.model('Instructor');

    if(Instructor.count(function(err, count) {

        if(!err && count === 0) {
            var instructors = require('../../data/instructors.json');

            if(instructors) {
                Instructor.collection.insert(instructors, onInsert);
                console.log(chalk.green('New Instructors added'), count);
            } else {
                console.log(chalk.red('There was an error retreiving the instructors data'));
            }

        } else if (err) {
            console.log(chalk.red('Instructor error'), err);
        } else {
            console.log(chalk.yellow('Instructors have already been added'), count);
        }
    }));
}

function seedLocations() {

    // generic:
    var Address = mongoose.model('Address');

    if(Address.count(function(err, count) {
        if(!err && count === 0) {
            var addresses = require('../../data/addresses.json');

            if(addresses) {
                Address.collection.insert(addresses, onInsert);
                console.log(chalk.green('New Addresses added'), count);
            } else {
                console.log(chalk.red('There was an error retreiving the address data'));
            }

        } else if (err) {
            console.log(chalk.red('Address error'), err);
        } else {
            console.log(chalk.yellow('Addresses already added!'), count);
        }
    }));

    // detailed:
    var LocationDetails = mongoose.model('LocationDetails');

    if(LocationDetails.count(function(err, count) {
        if(!err && count === 0) {
            var locations = require('../../data/locations.json');

            if(locations) {
                LocationDetails.collection.insert(locations, onInsert);
                console.log(chalk.green('New Locations added'), count);
            } else {
                console.log(chalk.red('There was an error retreiving the articles data'));
            }

        } else if(err) {
            console.log(chalk.red('Location details error'), err);
        } else {
            console.log(chalk.yellow('Location details have already been added!'), count);
        }
    }));
}

function onInsert(err, docs) {
    if(err) {
        console.log('error', err);
    } else {
        console.info('%d new doc added successfully', docs.length);
    }
}

module.exports.start = function start(options) {
    // Initialize the default seed options
    seedOptions = _.clone(config.seedDB.options, true);

    // Matt's data seeding
    seedInstructors();
    seedLocations();
    seedArticles();

    // Check for provided options

    if (_.has(options, 'logResults')) {
        seedOptions.logResults = options.logResults;
    }

    if (_.has(options, 'seedUser')) {
        seedOptions.seedUser = options.seedUser;
    }

    if (_.has(options, 'seedAdmin')) {
        seedOptions.seedAdmin = options.seedAdmin;
    }

    var User = mongoose.model('User');
    return new Promise(function(resolve, reject) {

        var adminAccount = new User(seedOptions.seedAdmin);
        var userAccount = new User(seedOptions.seedUser);

        //If production only seed admin if it does not exist
        if (process.env.NODE_ENV === 'production') {
            User.generateRandomPassphrase()
                .then(seedTheUser(adminAccount))
                .then(function() {
                    resolve();
                })
                .catch(reportError(reject));
        } else {
            // Add both Admin and User account

            User.generateRandomPassphrase()
                .then(seedTheUser(userAccount))
                .then(User.generateRandomPassphrase)
                .then(seedTheUser(adminAccount))
                .then(function() {
                    resolve();
                })
                .catch(reportError(reject));
        }
    });
};
