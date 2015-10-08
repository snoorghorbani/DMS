'use strict';

// Configuring the documents module
angular.module('documents').run(['Menus',
  function (Menus) {
    // Add the documents dropdown item
    Menus.addMenuItem('topbar', {
      title: 'documents',
      state: 'documents',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'documents', {
      title: 'List documents',
      state: 'documents.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'documents', {
      title: 'Create documents',
      state: 'documents.create',
      roles: ['user']
    });
  }
]);
