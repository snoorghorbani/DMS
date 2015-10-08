'use strict';

//documentTypes service used for communicating with the documentTypes REST endpoints
angular.module('documentTypes').factory('DocumentTypes', ['$resource',
  function ($resource) {
    return $resource('api/documentTypes/:documentTypeId', {
      documentTypeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
