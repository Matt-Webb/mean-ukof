'use strict';

/**
 * Module dependencies.
 */
var instructorsPolicy = require('../policies/instructors.server.policy'),
  instructors = require('../controllers/instructors.server.controller');

module.exports = function (app) {
  // Instructors collection routes
  app.route('/api/instructors').all(instructorsPolicy.isAllowed)
    .get(instructors.list);

  // Single instructor routes
  app.route('/api/instructors/:instructorId').all(instructorsPolicy.isAllowed)
    .get(instructors.read);

  // Finish by binding the instructor middleware
  app.param('instructorId', instructors.instructorByID);
};
