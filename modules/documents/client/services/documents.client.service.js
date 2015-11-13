'use strict';

//documents service used for communicating with the documents REST endpoints
angular.module('documents').factory('Documents', ['$resource',
  function ($resource) {
    return $resource('api/documents/:action/:documentId', {
      documentId: '@_id'
    }, {
        update: {
          method: 'PUT'
        },
        batchCreate: {
          method: 'POST'
        },
        instantiate: {
          method: 'GET',
          params: { action: 'instantiate' }
        }
      });
  }
]);
