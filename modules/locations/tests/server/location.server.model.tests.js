'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  EventLocation = mongoose.model('EventLocation');

/**
 * Globals
 */
var user, eventEventLocation;

/**
 * Unit tests
 */
describe('EventLocation Model Unit Tests:', function () {

  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    });

    user.save(function () {
      eventEventLocation = new EventLocation({
        title: 'EventLocation Title',
        content: 'EventLocation Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return eventEventLocation.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      eventEventLocation.title = '';

      return eventEventLocation.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    EventLocation.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
