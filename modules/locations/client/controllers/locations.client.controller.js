'use strict';

// EventLocations controller
angular.module('eventEventLocations').controller('EventLocationsController', ['$scope', '$stateParams', '$eventEventLocation', 'Authentication', 'EventLocations',
  function ($scope, $stateParams, $eventEventLocation, Authentication, EventLocations) {
    $scope.authentication = Authentication;


    // Find a list of EventLocations
    $scope.find = function () {
      $scope.eventEventLocations = EventLocations.query();
    };

    // Find existing EventLocation
    $scope.findOne = function () {
      $scope.eventEventLocation = EventLocations.get({
        eventEventLocationId: $stateParams.eventEventLocationId
      });
    };
  }
]);
