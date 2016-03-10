'use strict';

// Configuring the Instructors module
angular.module('instructors').run(['Menus',
  function (Menus) {
    // Add the instructors dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Instructors',
      state: 'instructors',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'instructors', {
      title: 'List Instructors',
      state: 'instructors.list'
    });

  }
]);
