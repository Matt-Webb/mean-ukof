'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  EventLocation = mongoose.model('EventLocation'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, eventEventLocation;

/**
 * EventLocation routes tests
 */
describe('EventLocation CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new eventEventLocation
    user.save(function () {
      eventEventLocation = {
        title: 'EventLocation Title',
        content: 'EventLocation Content'
      };

      done();
    });
  });

  it('should be able to save an eventEventLocation if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new eventEventLocation
        agent.post('/api/eventEventLocations')
          .send(eventEventLocation)
          .expect(200)
          .end(function (eventEventLocationSaveErr, eventEventLocationSaveRes) {
            // Handle eventEventLocation save error
            if (eventEventLocationSaveErr) {
              return done(eventEventLocationSaveErr);
            }

            // Get a list of eventEventLocations
            agent.get('/api/eventEventLocations')
              .end(function (eventEventLocationsGetErr, eventEventLocationsGetRes) {
                // Handle eventEventLocation save error
                if (eventEventLocationsGetErr) {
                  return done(eventEventLocationsGetErr);
                }

                // Get eventEventLocations list
                var eventEventLocations = eventEventLocationsGetRes.body;

                // Set assertions
                (eventEventLocations[0].user._id).should.equal(userId);
                (eventEventLocations[0].title).should.match('EventLocation Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an eventEventLocation if not logged in', function (done) {
    agent.post('/api/eventEventLocations')
      .send(eventEventLocation)
      .expect(403)
      .end(function (eventEventLocationSaveErr, eventEventLocationSaveRes) {
        // Call the assertion callback
        done(eventEventLocationSaveErr);
      });
  });

  it('should not be able to save an eventEventLocation if no title is provided', function (done) {
    // Invalidate title field
    eventEventLocation.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new eventEventLocation
        agent.post('/api/eventEventLocations')
          .send(eventEventLocation)
          .expect(400)
          .end(function (eventEventLocationSaveErr, eventEventLocationSaveRes) {
            // Set message assertion
            (eventEventLocationSaveRes.body.message).should.match('Title cannot be blank');

            // Handle eventEventLocation save error
            done(eventEventLocationSaveErr);
          });
      });
  });

  it('should be able to update an eventEventLocation if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new eventEventLocation
        agent.post('/api/eventEventLocations')
          .send(eventEventLocation)
          .expect(200)
          .end(function (eventEventLocationSaveErr, eventEventLocationSaveRes) {
            // Handle eventEventLocation save error
            if (eventEventLocationSaveErr) {
              return done(eventEventLocationSaveErr);
            }

            // Update eventEventLocation title
            eventEventLocation.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing eventEventLocation
            agent.put('/api/eventEventLocations/' + eventEventLocationSaveRes.body._id)
              .send(eventEventLocation)
              .expect(200)
              .end(function (eventEventLocationUpdateErr, eventEventLocationUpdateRes) {
                // Handle eventEventLocation update error
                if (eventEventLocationUpdateErr) {
                  return done(eventEventLocationUpdateErr);
                }

                // Set assertions
                (eventEventLocationUpdateRes.body._id).should.equal(eventEventLocationSaveRes.body._id);
                (eventEventLocationUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of eventEventLocations if not signed in', function (done) {
    // Create new eventEventLocation model instance
    var eventEventLocationObj = new EventLocation(eventEventLocation);

    // Save the eventEventLocation
    eventEventLocationObj.save(function () {
      // Request eventEventLocations
      request(app).get('/api/eventEventLocations')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single eventEventLocation if not signed in', function (done) {
    // Create new eventEventLocation model instance
    var eventEventLocationObj = new EventLocation(eventEventLocation);

    // Save the eventEventLocation
    eventEventLocationObj.save(function () {
      request(app).get('/api/eventEventLocations/' + eventEventLocationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', eventEventLocation.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single eventEventLocation with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/eventEventLocations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'EventLocation is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single eventEventLocation which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent eventEventLocation
    request(app).get('/api/eventEventLocations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No eventEventLocation with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an eventEventLocation if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new eventEventLocation
        agent.post('/api/eventEventLocations')
          .send(eventEventLocation)
          .expect(200)
          .end(function (eventEventLocationSaveErr, eventEventLocationSaveRes) {
            // Handle eventEventLocation save error
            if (eventEventLocationSaveErr) {
              return done(eventEventLocationSaveErr);
            }

            // Delete an existing eventEventLocation
            agent.delete('/api/eventEventLocations/' + eventEventLocationSaveRes.body._id)
              .send(eventEventLocation)
              .expect(200)
              .end(function (eventEventLocationDeleteErr, eventEventLocationDeleteRes) {
                // Handle eventEventLocation error error
                if (eventEventLocationDeleteErr) {
                  return done(eventEventLocationDeleteErr);
                }

                // Set assertions
                (eventEventLocationDeleteRes.body._id).should.equal(eventEventLocationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an eventEventLocation if not signed in', function (done) {
    // Set eventEventLocation user
    eventEventLocation.user = user;

    // Create new eventEventLocation model instance
    var eventEventLocationObj = new EventLocation(eventEventLocation);

    // Save the eventEventLocation
    eventEventLocationObj.save(function () {
      // Try deleting eventEventLocation
      request(app).delete('/api/eventEventLocations/' + eventEventLocationObj._id)
        .expect(403)
        .end(function (eventEventLocationDeleteErr, eventEventLocationDeleteRes) {
          // Set message assertion
          (eventEventLocationDeleteRes.body.message).should.match('User is not authorized');

          // Handle eventEventLocation error error
          done(eventEventLocationDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      EventLocation.remove().exec(done);
    });
  });
});
