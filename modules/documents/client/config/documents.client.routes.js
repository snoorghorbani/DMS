'use strict';

// Setting up route
angular.module('documents').config(['$stateProvider',
  function ($stateProvider) {
    // documents state routing
    $stateProvider
      .state('documents', {
        abstract: true,
        url: '/documents',
        template: '<ui-view/>'
      })
      .state('documents.list', {
        url: '',
        templateUrl: 'modules/documents/client/views/list-documents.client.view.html'
      })
      .state('documents.create', {
        url: '/create',
        templateUrl: 'modules/documents/client/views/create-document.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('documents.view', {
        url: '/:documentId',
        templateUrl: 'modules/documents/client/views/view-document.client.view.html'
      })
      .state('documents.edit', {
        url: '/:documentId/edit',
        templateUrl: 'modules/documents/client/views/edit-document.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
