'use strict';

//EventLocations service used for communicating with the eventEventLocations REST endpoints
angular.module('eventEventLocations').factory('EventLocations', ['$resource',
  function ($resource) {
    return $resource('api/eventEventLocations/:eventEventLocationId', {
      eventEventLocationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
