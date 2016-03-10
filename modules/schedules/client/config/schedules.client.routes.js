'use strict';

// Setting up route
angular.module('schedules').config(['$stateProvider',
  function ($stateProvider) {
    // Schedules state routing
    $stateProvider
      .state('schedules', {
        abstract: true,
        url: '/schedules',
        template: '<ui-view/>'
      })
      .state('schedules.list', {
        url: '',
        templateUrl: 'modules/schedules/client/views/list-schedules.client.view.html'
      })
      .state('schedules.create', {
        url: '/create',
        templateUrl: 'modules/schedules/client/views/create-schedule.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('schedules.view', {
        url: '/:scheduleId',
        templateUrl: 'modules/schedules/client/views/view-schedule.client.view.html'
      })
      .state('schedules.edit', {
        url: '/:scheduleId/edit',
        templateUrl: 'modules/schedules/client/views/edit-schedule.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
