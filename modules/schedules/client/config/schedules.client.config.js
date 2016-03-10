'use strict';

// Configuring the Schedules module
angular.module('schedules').run(['Menus',
  function (Menus) {
    // Add the schedules dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Schedules',
      state: 'schedules',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'schedules', {
      title: 'List Schedules',
      state: 'schedules.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'schedules', {
      title: 'Create Schedules',
      state: 'schedules.create',
      roles: ['user']
    });
  }
]);
