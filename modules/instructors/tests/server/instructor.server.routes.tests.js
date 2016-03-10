'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Instructor = mongoose.model('Instructor'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, instructor;

/**
 * Instructor routes tests
 */
describe('Instructor CRUD tests', function () {

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

    // Save a user to the test db and create new instructor
    user.save(function () {
      instructor = {
        title: 'Instructor Title',
        content: 'Instructor Content'
      };

      done();
    });
  });

  it('should be able to save an instructor if logged in', function (done) {
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

        // Save a new instructor
        agent.post('/api/instructors')
          .send(instructor)
          .expect(200)
          .end(function (instructorSaveErr, instructorSaveRes) {
            // Handle instructor save error
            if (instructorSaveErr) {
              return done(instructorSaveErr);
            }

            // Get a list of instructors
            agent.get('/api/instructors')
              .end(function (instructorsGetErr, instructorsGetRes) {
                // Handle instructor save error
                if (instructorsGetErr) {
                  return done(instructorsGetErr);
                }

                // Get instructors list
                var instructors = instructorsGetRes.body;

                // Set assertions
                (instructors[0].user._id).should.equal(userId);
                (instructors[0].title).should.match('Instructor Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an instructor if not logged in', function (done) {
    agent.post('/api/instructors')
      .send(instructor)
      .expect(403)
      .end(function (instructorSaveErr, instructorSaveRes) {
        // Call the assertion callback
        done(instructorSaveErr);
      });
  });

  it('should not be able to save an instructor if no title is provided', function (done) {
    // Invalidate title field
    instructor.title = '';

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

        // Save a new instructor
        agent.post('/api/instructors')
          .send(instructor)
          .expect(400)
          .end(function (instructorSaveErr, instructorSaveRes) {
            // Set message assertion
            (instructorSaveRes.body.message).should.match('Title cannot be blank');

            // Handle instructor save error
            done(instructorSaveErr);
          });
      });
  });

  it('should be able to update an instructor if signed in', function (done) {
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

        // Save a new instructor
        agent.post('/api/instructors')
          .send(instructor)
          .expect(200)
          .end(function (instructorSaveErr, instructorSaveRes) {
            // Handle instructor save error
            if (instructorSaveErr) {
              return done(instructorSaveErr);
            }

            // Update instructor title
            instructor.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing instructor
            agent.put('/api/instructors/' + instructorSaveRes.body._id)
              .send(instructor)
              .expect(200)
              .end(function (instructorUpdateErr, instructorUpdateRes) {
                // Handle instructor update error
                if (instructorUpdateErr) {
                  return done(instructorUpdateErr);
                }

                // Set assertions
                (instructorUpdateRes.body._id).should.equal(instructorSaveRes.body._id);
                (instructorUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of instructors if not signed in', function (done) {
    // Create new instructor model instance
    var instructorObj = new Instructor(instructor);

    // Save the instructor
    instructorObj.save(function () {
      // Request instructors
      request(app).get('/api/instructors')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single instructor if not signed in', function (done) {
    // Create new instructor model instance
    var instructorObj = new Instructor(instructor);

    // Save the instructor
    instructorObj.save(function () {
      request(app).get('/api/instructors/' + instructorObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', instructor.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single instructor with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/instructors/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Instructor is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single instructor which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent instructor
    request(app).get('/api/instructors/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No instructor with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an instructor if signed in', function (done) {
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

        // Save a new instructor
        agent.post('/api/instructors')
          .send(instructor)
          .expect(200)
          .end(function (instructorSaveErr, instructorSaveRes) {
            // Handle instructor save error
            if (instructorSaveErr) {
              return done(instructorSaveErr);
            }

            // Delete an existing instructor
            agent.delete('/api/instructors/' + instructorSaveRes.body._id)
              .send(instructor)
              .expect(200)
              .end(function (instructorDeleteErr, instructorDeleteRes) {
                // Handle instructor error error
                if (instructorDeleteErr) {
                  return done(instructorDeleteErr);
                }

                // Set assertions
                (instructorDeleteRes.body._id).should.equal(instructorSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an instructor if not signed in', function (done) {
    // Set instructor user
    instructor.user = user;

    // Create new instructor model instance
    var instructorObj = new Instructor(instructor);

    // Save the instructor
    instructorObj.save(function () {
      // Try deleting instructor
      request(app).delete('/api/instructors/' + instructorObj._id)
        .expect(403)
        .end(function (instructorDeleteErr, instructorDeleteRes) {
          // Set message assertion
          (instructorDeleteRes.body.message).should.match('User is not authorized');

          // Handle instructor error error
          done(instructorDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Instructor.remove().exec(done);
    });
  });
});
