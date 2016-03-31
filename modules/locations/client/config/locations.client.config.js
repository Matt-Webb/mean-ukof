'use strict';

// Configuring the EventLocations module
angular.module('eventEventLocations').run(['Menus',
  function (Menus) {
    // Add the eventEventLocations dropdown item
    Menus.addMenuItem('topbar', {
      title: 'EventLocations',
      state: 'eventEventLocations',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'eventEventLocations', {
      title: 'List EventLocations',
      state: 'eventEventLocations.list'
    });

  }
]);
