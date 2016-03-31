'use strict';

// Setting up route
angular.module('eventEventLocations').config(['$stateProvider',
  function ($stateProvider) {
    // EventLocations state routing
    $stateProvider
      .state('eventEventLocations', {
        abstract: true,
        url: '/eventEventLocations',
        template: '<ui-view/>'
      })
      .state('eventEventLocations.list', {
        url: '',
        templateUrl: 'modules/eventEventLocations/client/views/list-eventEventLocations.client.view.html'
      })
      .state('eventEventLocations.view', {
        url: '/:eventEventLocationId',
        templateUrl: 'modules/eventEventLocations/client/views/view-eventEventLocation.client.view.html'
      });
  }
]);
