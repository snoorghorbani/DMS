'use strict';

// Configuring the documentTypes module
angular.module('documentTypes').run(['Menus',
  function (Menus) {
    // Add the documentTypes dropdown item
    Menus.addMenuItem('topbar', {
      title: 'documentTypes',
      state: 'documentTypes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'documentTypes', {
      title: 'List documentTypes',
      state: 'documentTypes.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'documentTypes', {
      title: 'Create documentTypes',
      state: 'documentTypes.create',
      roles: ['user']
    });
  }
]);
