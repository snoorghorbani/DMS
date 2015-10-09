'use strict';

// Configuring the tags module
angular.module('tags').run(['Menus',
  function (Menus) {
    // Add the tags dropdown item
    Menus.addMenuItem('topbar', {
      title: 'tags',
      state: 'tags',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'tags', {
      title: 'List tags',
      state: 'tags.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'tags', {
      title: 'Create tags',
      state: 'tags.create',
      roles: ['user']
    });
  }
]);
