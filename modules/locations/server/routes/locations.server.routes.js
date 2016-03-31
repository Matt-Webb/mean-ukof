'use strict';

/**
 * Module dependencies.
 */
var eventEventLocationsPolicy = require('../policies/eventEventLocations.server.policy'),
  eventEventLocations = require('../controllers/eventEventLocations.server.controller');

module.exports = function (app) {
  // EventLocations collection routes
  app.route('/api/eventEventLocations').all(eventEventLocationsPolicy.isAllowed)
    .get(eventEventLocations.list);

  // Single eventEventLocation routes
  app.route('/api/eventEventLocations/:eventEventLocationId').all(eventEventLocationsPolicy.isAllowed)
    .get(eventEventLocations.read);

  // Finish by binding the eventEventLocation middleware
  app.param('eventEventLocationId', eventEventLocations.eventEventLocationByID);
};
