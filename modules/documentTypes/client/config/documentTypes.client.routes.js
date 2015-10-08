'use strict';

// Setting up route
angular.module('documentTypes').config(['$stateProvider',
  function ($stateProvider) {
    // documentTypes state routing
    $stateProvider
      .state('documentTypes', {
        abstract: true,
        url: '/documentTypes',
        template: '<ui-view/>'
      })
      .state('documentTypes.list', {
        url: '',
        templateUrl: 'modules/documentTypes/client/views/list-documentTypes.client.view.html'
      })
      .state('documentTypes.create', {
        url: '/create',
        templateUrl: 'modules/documentTypes/client/views/create-documentType.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('documentTypes.view', {
        url: '/:documentTypeId',
        templateUrl: 'modules/documentTypes/client/views/view-documentType.client.view.html'
      })
      .state('documentTypes.edit', {
        url: '/:documentTypeId/edit',
        templateUrl: 'modules/documentTypes/client/views/edit-documentType.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
