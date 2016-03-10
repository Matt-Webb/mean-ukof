'use strict';

/**
 * Module dependencies.
 */
var schedulesPolicy = require('../policies/schedules.server.policy'),
  schedules = require('../controllers/schedules.server.controller');

module.exports = function (app) {
  // Schedules collection routes
  app.route('/api/schedules').all(schedulesPolicy.isAllowed)
    .get(schedules.list);

  // Single schedule routes
  app.route('/api/schedules/:scheduleId').all(schedulesPolicy.isAllowed)
    .get(schedules.read);

  // Finish by binding the schedule middleware
  app.param('scheduleId', schedules.scheduleByID);
};
