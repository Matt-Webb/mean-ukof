'use strict';

// Setting up route
angular.module('instructors').config(['$stateProvider',
  function ($stateProvider) {
    // Instructors state routing
    $stateProvider
      .state('instructors', {
        abstract: true,
        url: '/instructors',
        template: '<ui-view/>'
      })
      .state('instructors.list', {
        url: '',
        templateUrl: 'modules/instructors/client/views/list-instructors.client.view.html'
      })
      .state('instructors.view', {
        url: '/:instructorId',
        templateUrl: 'modules/instructors/client/views/view-instructor.client.view.html'
      });
  }
]);
