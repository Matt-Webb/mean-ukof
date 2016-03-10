'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Article = mongoose.model('Article'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, schedule;

/**
 * Article routes tests
 */
describe('Article CRUD tests', function () {

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

    // Save a user to the test db and create new schedule
    user.save(function () {
      schedule = {
        title: 'Article Title',
        content: 'Article Content'
      };

      done();
    });
  });

  it('should be able to save an schedule if logged in', function (done) {
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

        // Save a new schedule
        agent.post('/api/schedules')
          .send(schedule)
          .expect(200)
          .end(function (scheduleSaveErr, scheduleSaveRes) {
            // Handle schedule save error
            if (scheduleSaveErr) {
              return done(scheduleSaveErr);
            }

            // Get a list of schedules
            agent.get('/api/schedules')
              .end(function (schedulesGetErr, schedulesGetRes) {
                // Handle schedule save error
                if (schedulesGetErr) {
                  return done(schedulesGetErr);
                }

                // Get schedules list
                var schedules = schedulesGetRes.body;

                // Set assertions
                (schedules[0].user._id).should.equal(userId);
                (schedules[0].title).should.match('Article Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an schedule if not logged in', function (done) {
    agent.post('/api/schedules')
      .send(schedule)
      .expect(403)
      .end(function (scheduleSaveErr, scheduleSaveRes) {
        // Call the assertion callback
        done(scheduleSaveErr);
      });
  });

  it('should not be able to save an schedule if no title is provided', function (done) {
    // Invalidate title field
    schedule.title = '';

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

        // Save a new schedule
        agent.post('/api/schedules')
          .send(schedule)
          .expect(400)
          .end(function (scheduleSaveErr, scheduleSaveRes) {
            // Set message assertion
            (scheduleSaveRes.body.message).should.match('Title cannot be blank');

            // Handle schedule save error
            done(scheduleSaveErr);
          });
      });
  });

  it('should be able to update an schedule if signed in', function (done) {
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

        // Save a new schedule
        agent.post('/api/schedules')
          .send(schedule)
          .expect(200)
          .end(function (scheduleSaveErr, scheduleSaveRes) {
            // Handle schedule save error
            if (scheduleSaveErr) {
              return done(scheduleSaveErr);
            }

            // Update schedule title
            schedule.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing schedule
            agent.put('/api/schedules/' + scheduleSaveRes.body._id)
              .send(schedule)
              .expect(200)
              .end(function (scheduleUpdateErr, scheduleUpdateRes) {
                // Handle schedule update error
                if (scheduleUpdateErr) {
                  return done(scheduleUpdateErr);
                }

                // Set assertions
                (scheduleUpdateRes.body._id).should.equal(scheduleSaveRes.body._id);
                (scheduleUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of schedules if not signed in', function (done) {
    // Create new schedule model instance
    var scheduleObj = new Article(schedule);

    // Save the schedule
    scheduleObj.save(function () {
      // Request schedules
      request(app).get('/api/schedules')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single schedule if not signed in', function (done) {
    // Create new schedule model instance
    var scheduleObj = new Article(schedule);

    // Save the schedule
    scheduleObj.save(function () {
      request(app).get('/api/schedules/' + scheduleObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', schedule.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single schedule with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/schedules/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Article is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single schedule which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent schedule
    request(app).get('/api/schedules/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No schedule with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an schedule if signed in', function (done) {
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

        // Save a new schedule
        agent.post('/api/schedules')
          .send(schedule)
          .expect(200)
          .end(function (scheduleSaveErr, scheduleSaveRes) {
            // Handle schedule save error
            if (scheduleSaveErr) {
              return done(scheduleSaveErr);
            }

            // Delete an existing schedule
            agent.delete('/api/schedules/' + scheduleSaveRes.body._id)
              .send(schedule)
              .expect(200)
              .end(function (scheduleDeleteErr, scheduleDeleteRes) {
                // Handle schedule error error
                if (scheduleDeleteErr) {
                  return done(scheduleDeleteErr);
                }

                // Set assertions
                (scheduleDeleteRes.body._id).should.equal(scheduleSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an schedule if not signed in', function (done) {
    // Set schedule user
    schedule.user = user;

    // Create new schedule model instance
    var scheduleObj = new Article(schedule);

    // Save the schedule
    scheduleObj.save(function () {
      // Try deleting schedule
      request(app).delete('/api/schedules/' + scheduleObj._id)
        .expect(403)
        .end(function (scheduleDeleteErr, scheduleDeleteRes) {
          // Set message assertion
          (scheduleDeleteRes.body.message).should.match('User is not authorized');

          // Handle schedule error error
          done(scheduleDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Article.remove().exec(done);
    });
  });
});
