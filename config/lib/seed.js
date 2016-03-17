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

function seedInstructors() {

    var Instructor = mongoose.model('Instructor');

    if(Instructor.count(function(err, count){

        if(!err && count === 0) {
            var instructors = [{
                    'name': 'Paul Smith',
                    'role': 'Owner and Instructor Trainer',
                    'locations': [],
                    'bio': 'Paul is a motivational, enthusiastic, fun and adaptable trainer. He provides sessions and classes that adapt to your needs; whether you are a complete beginner or want to take your fitness to the next level. You’ll be pushed to your personal limits.',
                    'specialities': [
                        'Fun workouts – Group training – Sport Specific Training',
                        'ViPR Training',
                        'Weight Loss – Healthy Living',
                        'Safe Exercise and Injury Prevention',
                        'Pre-Post Natal'
                    ],
                    'image': 'modules/instructors/client/img/instructors/paul-smith.jpg',
                    'social': {
                        'facebook': 'https://www.facebook.com/ukoutdoorfitness',
                        'twitter': 'https://twitter.com/fitnessleeds',
                        'linkedin': 'http://uk.linkedin.com/pub/paul-smith/18/2a4/904'
                    }
                }, {
                    'name': 'Lynn Moorhouse',
                    'role': 'Office Manager and Instructor',
                    'locations': [],
                    'bio': 'Lynn is one of our longest serving trainers starting at Baildon Bootcamp and now running sessions all over West Leeds and Baildon. Lynn is a high class levels 3 personal trainer and group fitness instructor as well as qualified in Pilates and a black belt in Kick Boxing',
                    'specialities': [
                        'Personal Trainer Level 3',
                        'Pre and Post Natal',
                        'Level 3 Advanced Pilates',
                        'Torso training and Core Stability',
                        'Nutrition and Weight management',
                        'Circuit training'
                    ],
                    'image': 'modules/instructors/client/img/instructors/lynn-moorhouse.jpg',
                    'social': {
                        'facebook': '',
                        'twitter': '',
                        'linkedin': ''
                    }
                }, {
                    'name': 'Rob Maher',
                    'role': 'Marketing Manager and Lead Instructor',
                    'locations': [],
                    'bio': 'Rob has developed the nickname ‘Evil Rob’ for his enthusiastic approach, safely pushing you to your personal limits. Rob’s passion is to educate, motivate and inspire every single member his classes to achieve their personal health and fitness goals.',
                    'specialities': [
                        'Circuits',
                        'Corrective exercise, injury management/ prevention',
                        'Weight Management/Body Fat Loss',
                        'Nutrition',
                        'Fun session/fitness games'
                    ],
                    'image': 'modules/instructors/client/img/instructors/rob-maher.jpg',
                    'social': {
                        'facebook': '',
                        'twitter': '',
                        'linkedin': ''
                    }
                }, {
                    'name': 'Russ Dales',
                    'role': 'South Yorkshire Manager',
                    'locations': [],
                    'bio': 'Russ motivational, enthusiastic, and Popular trainer who manages our south Yorkshire Programme. He provides sessions and classes that adapt to your needs; whether you are a complete beginner or want to take your fitness to the next level. You’ll be pushed to your personal limits.',
                    'specialities': [
                        'Fun workouts – Group training – Sport Specific Training',
                        'Strength and conditioning',
                        'Weight Loss – Healthy Living',
                        'Safe Exercise and Injury Prevention',
                        'Boxing style Bootcamps'
                    ],
                    'image': 'modules/instructors/client/img/instructors/russ-dales.jpg',
                    'social': {
                        'facebook': '',
                        'twitter': '',
                        'linkedin': ''
                    }
                }, {
                    'name': 'Rupert Harold',
                    'role': '',
                    'locations': [],
                    'bio': '',
                    'specialities': [],
                    'image': 'modules/instructors/client/img/instructors/rupert-harold.jpg',
                    'social': {
                        'facebook': '',
                        'twitter': '',
                        'linkedin': ''
                    }
                }, {
                    'name': 'Ady Thorne',
                    'role': 'Leeds Instructor',
                    'locations': [],
                    'bio': '',
                    'specialities': [
                        'Level 3 Personal Trainer',
                        'Ex Army'
                    ],
                    'image': 'modules/instructors/client/img/instructors/ady-thorne.jpg',
                    'social': {
                        'facebook': '',
                        'twitter': '',
                        'linkedin': ''
                    }
                }, {
                    'name': 'Jon Fawcett',
                    'role': 'Bootcamp Instructor',
                    'locations': [],
                    'bio': '',
                    'specialities': [],
                    'image': 'modules/instructors/client/img/instructors/jon-fawcett.jpg',
                    'social': {
                        'facebook': '',
                        'twitter': '',
                        'linkedin': ''
                    }
                }, {
                    'name': 'Lee Parfitt',
                    'role': 'Sheffield Trainer and Rehab Specialist',
                    'locations': [],
                    'bio': 'Lee is one of our most qualified and experience trainers having over 20 years in the army as a PTI with level 4 in rehab and exercise. Lee runs our Saturday morning with popular classes at Hillsborough park. His sessions will push you to the max with optimum results and output but also catering for your level of fitness whether you are a beginner or advanced fitness fanatic',
                    'specialities': [],
                    'image': 'modules/instructors/client/img/instructors/lee-parfitt.jpg',
                    'social': {
                        'facebook': '',
                        'twitter': '',
                        'linkedin': ''
                    }
                }, {
                    'name': 'Marvin Sahebjam',
                    'role': 'Instructor',
                    'locations': [],
                    'bio': '',
                    'specialities': [
                        'Level 3 Personal Training',
                        'Level 4 Sport Massage'
                    ],
                    'image': 'modules/instructors/client/img/instructors/marvin-sahebjam.jpg',
                    'social': {
                        'facebook': '',
                        'twitter': '',
                        'linkedin': ''
                    }
                }, {
                    'name': 'Chris Trott',
                    'role': '',
                    'locations': [],
                    'bio': '',
                    'specialities': [],
                    'image': 'modules/instructors/client/img/instructors/chris-trott.jpg',
                    'social': {
                        'facebook': '',
                        'twitter': '',
                        'linkedin': ''
                    }
                }, {
                    'name': 'Ryan Robinson',
                    'role': '',
                    'locations': [],
                    'bio': '',
                    'specialities': [
                        'Personal Training Level 3',
                        'Mixed Martial Arts'
                    ],
                    'image': 'modules/instructors/client/img/instructors/ryan-robinson.jpg',
                    'social': {
                        'facebook': '',
                        'twitter': '',
                        'linkedin': ''
                    }
                }, {
                    'name': 'James Green',
                    'role': 'Sheffield Instructor',
                    'locations': [],
                    'bio': '',
                    'specialities': [],
                    'image': 'modules/instructors/client/img/instructors/james-green.jpg',
                    'social': {
                        'facebook': '',
                        'twitter': '',
                        'linkedin': ''
                    }
                }, {
                    'name': 'Adam Endersby',
                    'role': '',
                    'locations': [],
                    'bio': '',
                    'specialities': [],
                    'image': 'modules/instructors/client/img/instructors/adam-endersby.jpg',
                    'social': {
                        'facebook': '',
                        'twitter': '',
                        'linkedin': ''
                    }
                }, {
                    'name': 'Gareth Clough',
                    'role': '',
                    'locations': [],
                    'bio': '',
                    'specialities': [
                        'Level 3 Personal Training',
                        'Team Sports'
                    ],
                    'image': 'modules/instructors/client/img/instructors/gareth-clough.jpg',
                    'social': {
                        'facebook': '',
                        'twitter': '',
                        'linkedin': ''
                    }
                }, {
                    'name': 'Eric Chitty',
                    'role': '',
                    'locations': [],
                    'bio': '',
                    'specialities': [
                        'Boxercise',
                        'Level 3 Personal Trainer'
                    ],
                    'image': 'modules/instructors/client/img/instructors/eric-chitty.jpg',
                    'social': {
                        'facebook': '',
                        'twitter': '',
                        'linkedin': ''
                    }
                }, {
                    'name': 'Mark Sullivan',
                    'role': '',
                    'locations': [],
                    'bio': 'Mark completed 22 years in the armed forces in July 1998, having served in Northern Ireland, UK mainland, Cyprus, Hong Kong, Germany and Bosnia.  Whilst serving he was awarded a Mention in Dispatches (MiD).  He left to pursue a career in Personal Training and Sports Therapy whilst completing a Masters programme.  In 2002 he started work at York St John University and at the same time also featured on Lads Army (2002) and Bad Lads Army (2004) as one of the military staff.  He has worked here in coaching studies and latterly in Sports Science and Injury Management. When not working at the University he is a member of the Territorial Army and also a member of the Queen’s Body Guard of The Yeomen of The Guard. He has completed over 40 marathons for charity and every year since 2004 has taken third year students on Trailwalker, a 100km walk on the South Downs, which has to be completed within 30 hours. Instructor on TV show Bad lads Army.',
                    'specialities': [],
                    'image': 'modules/instructors/client/img/instructors/mark-sullivan.jpg',
                    'social': {
                        'facebook': '',
                        'twitter': '',
                        'linkedin': ''
                    }
                }];

            Instructor.collection.insert(instructors, onInsert);

        } else if (err) {
            console.log('Instructor error', err);
        } else {
            console.log('Instructors have already been added');
        }
    }));
}

function seedLocations() {

    // generic:
    var Address = mongoose.model('Address');

    if(Address.count(function(err, count) {
        if(!err && count === 0) {
            var addresses = [{ //0
                    'venue': 'South Parade Baptish Church',
                    'street': 'Kirkstall Lane',
                    'city': 'Leeds',
                    'county': 'West Yorkshire',
                    'postcode': 'LS6 3LF',
                    'longditude': 1.581807,
                    'latitude': 53.819683
                }, { // 1
                    'venue': 'Brigshaw High School',
                    'street': '',
                    'city': 'Kippax',
                    'county': 'West Yorkshire',
                    'postcode': 'WF10 2HR',
                    'longditude': -1.384448,
                    'latitude': 53.757327
                }, { // 2
                    'venue': 'Kirkstall Abbey',
                    'street': '',
                    'city': 'Leeds',
                    'county': 'West Yorkshire',
                    'postcode': 'LS5 3SB',
                    'longditude': -1.608547,
                    'latitude': 53.825588
                }, { // 3
                    'venue': 'Drighlington',
                    'street': 'Moorland Road ',
                    'city': 'Bradford',
                    'county': 'West Yorkshire',
                    'postcode': 'BD11 1JY',
                    'longditude': -1.663417,
                    'latitude': 53.753805
                }, { // 4
                    'venue': 'Airedale Academy',
                    'street': '',
                    'city': 'Castleford',
                    'county': 'West Yorkshire',
                    'postcode': 'WF10 3JU',
                    'longditude': -1.311235,
                    'latitude': 53.721147
                }, { // 5
                    'venue': 'Roundhay Park',
                    'street': 'Princes Avenue',
                    'city': 'Leeds',
                    'county': 'West Yorkshire',
                    'postcode': '',
                }, { // 6
                    'venue': 'Temple Newsam',
                    'street': '',
                    'city': 'Leeds',
                    'county': 'West Yorkshire',
                    'postcode': 'LS15 0AE',
                    'longditude': -1.459710,
                    'latitude': 53.784330
                }, { // 7
                    'venue': 'Westroyd Park Farsley',
                    'street': '',
                    'city': 'Leeds',
                    'county': 'West Yorkshire',
                    'postcode': 'LS28 5AS',
                    'longditude': -1.670865,
                    'latitude': 53.808006
                }, { // 8
                    'venue': 'Baildon Rugby Club',
                    'street': 'Jenny Lane, Shipley',
                    'city': 'Bradford',
                    'county': 'West Yorkshire',
                    'postcode': 'BD17 6RS',
                    'longditude': -1.762082,
                    'latitude': 53.856630
                }, { // 9
                    'venue': 'Goals Sheffield',
                    'street': '95 Norfolk Park Road',
                    'city': 'Sheffield',
                    'county': 'South Yorkshire',
                    'postcode': 'S2 2RU',
                    'longditude': -1.455517,
                    'latitude': 53.373101
                }, { // 10
                    'venue': 'Hillsborough Park',
                    'street': '',
                    'city': 'Sheffield',
                    'county': 'South Yorkshire',
                    'postcode': ''
                }, { // 11
                    'venue': 'Millhouses Park',
                    'street': '',
                    'city': 'Sheffield',
                    'county': 'South Yorkshire',
                    'postcode': 'S7 2QN',
                    'longditude': -1.498682,
                    'latitude': 53.345065
                }, { // 12
                    'venue': 'Knavesmire',
                    'street': 'Knavesmire Road',
                    'city': 'York',
                    'county': 'North Yorkshire',
                    'postcode': 'YO24 1DJ',
                    'longditude': -1.098712,
                    'latitude': 53.949602
                }, { // 13
                    'venue': 'All Saints Catholic College',
                    'street': 'Bradley Road',
                    'city': 'Huddersfield',
                    'county': '',
                    'postcode': 'HD2 2JT',
                    'longditude': -1.772124,
                    'latitude': 53.678399
                }];


                Address.collection.insert(addresses, onInsert);

        } else if (err) {
            console.log('Address error', err);
        } else {
            console.log('addresses already added!');
        }
    }));

    // detailed:
    var LocationDetails = mongoose.model('LocationDetails');

    if(LocationDetails.count(function(err, count) {
        if(!err && count === 0) {
            var locations = [{
                      'name': 'Kirkstall Abbey',
                      'address': { // 2
                        'venue': 'Kirkstall Abbey',
                        'street': '',
                        'city': 'Leeds',
                        'county': 'West Yorkshire',
                        'postcode': 'LS5 3SB',
                        'longditude': -1.608547,
                        'latitude': 53.825588
                      },
                      'image': null,
                      'active': true,
                      'outdoor': true,
                      'indoor': false
                    }, {
                      'name': 'Headingley',
                      'address': { //0
                        'venue': 'South Parade Baptish Church',
                        'street': 'Kirkstall Lane',
                        'city': 'Leeds',
                        'county': 'West Yorkshire',
                        'postcode': 'LS6 3LF',
                        'longditude': 1.581807,
                        'latitude': 53.819683
                      },
                      'image': null,
                      'active': true,
                      'outdoor': true,
                      'indoor': false
                    }, {
                      'name': 'Temple Newsam',
                      'address': { // 6
                        'venue': 'Temple Newsam',
                        'street': '',
                        'city': 'Leeds',
                        'county': 'West Yorkshire',
                        'postcode': 'LS15 0AE',
                        'longditude': -1.459710,
                        'latitude': 53.784330
                      },
                      'image': null,
                      'active': true,
                      'outdoor': true,
                      'indoor': false
                    }, {
                      'name': 'Farsley',
                      'address': { // 7
                        'venue': 'Westroyd Park Farsley',
                        'street': '',
                        'city': 'Leeds',
                        'county': 'West Yorkshire',
                        'postcode': 'LS28 5AS',
                        'longditude': -1.670865,
                        'latitude': 53.808006
                      },
                      'image': null,
                      'active': true,
                      'outdoor': true,
                      'indoor': false
                    }, {
                      'name': 'Kippax',
                      'address': { // 1
                        'venue': 'Brigshaw High School',
                        'street': '',
                        'city': 'Kippax',
                        'county': 'West Yorkshire',
                        'postcode': 'WF10 2HR',
                        'longditude': -1.384448,
                        'latitude': 53.757327
                      },
                      'image': null,
                      'active': true,
                      'outdoor': true,
                      'indoor': false
                    }, {
                      'name': 'Airedale Academy',
                      'address': { // 4
                        'venue': 'Airedale Academy',
                        'street': '',
                        'city': 'Castleford',
                        'county': 'West Yorkshire',
                        'postcode': 'WF10 3JU',
                        'longditude': -1.311235,
                        'latitude': 53.721147
                      },
                      'image': null,
                      'active': true,
                      'outdoor': true,
                      'indoor': false
                    }, {
                      'name': 'The Knavesmire',
                      'address': { // 12
                        'venue': 'Knavesmire',
                        'street': 'Knavesmire Road',
                        'city': 'York',
                        'county': 'North Yorkshire',
                        'postcode': 'YO24 1DJ',
                        'longditude': -1.098712,
                        'latitude': 53.949602
                      },
                      'image': null,
                      'active': true,
                      'outdoor': true,
                      'indoor': false
                    }, {
                      'name': 'Hillsborough Park',
                      'address': { // 10
                        'venue': 'Hillsborough Park',
                        'street': '',
                        'city': 'Sheffield',
                        'county': 'South Yorkshire',
                        'postcode': ''
                      },
                      'image': null,
                      'active': true,
                      'outdoor': true,
                      'indoor': false
                    }, {
                      'name': 'Millhouses Park',
                      'address': { // 11
                        'venue': 'Millhouses Park',
                        'street': '',
                        'city': 'Sheffield',
                        'county': 'South Yorkshire',
                        'postcode': 'S7 2QN',
                        'longditude': -1.498682,
                        'latitude': 53.345065
                      },
                      'image': null,
                      'active': true,
                      'outdoor': true,
                      'indoor': false
                    }, {
                      'name': 'All Saints Catholic College',
                      'address': { // 13
                        'venue': 'All Saints Catholic College',
                        'street': 'Bradley Road',
                        'city': 'Huddersfield',
                        'county': '',
                        'postcode': 'HD2 2JT',
                        'longditude': -1.772124,
                        'latitude': 53.678399
                      },
                      'image': null,
                      'active': true,
                      'outdoor': true,
                      'indoor': false
                    }, {
                      'name': 'Baildon Rugby Club',
                      'address': { // 8
                        'venue': 'Baildon Rugby Club',
                        'street': 'Jenny Lane, Shipley',
                        'city': 'Bradford',
                        'county': 'West Yorkshire',
                        'postcode': 'BD17 6RS',
                        'longditude': -1.762082,
                        'latitude': 53.856630
                      },
                      'image': null,
                      'active': true,
                      'outdoor': true,
                      'indoor': false
                    }, {
                      'name': 'Drighlington Moor',
                      'address': { // 3
                        'venue': 'Drighlington',
                        'street': 'Moorland Road ',
                        'city': 'Bradford',
                        'county': 'West Yorkshire',
                        'postcode': 'BD11 1JY',
                        'longditude': -1.663417,
                        'latitude': 53.753805
                      },
                      'image': null,
                      'active': true,
                      'outdoor': true,
                      'indoor': false
                    }];

                    LocationDetails.collection.insert(locations, onInsert);

        } else if(err) {
            console.log('Location details error', err);
        } else {
            console.log('Location details have already been added!');
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
