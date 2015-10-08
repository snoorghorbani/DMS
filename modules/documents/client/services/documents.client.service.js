'use strict';

//documents service used for communicating with the documents REST endpoints
angular.module('documents').factory('Documents', ['$resource',
  function ($resource) {
    return $resource('api/documents/:documentId', {
      documentId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
