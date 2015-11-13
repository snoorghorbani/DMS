'use strict';

// Users directive used to force lowercase input
angular.module('documents').directive('relation', ['Documents', function (Documents) {
  return {
    restrict:"E",
    templateUrl:'modules/documents/client/views/relation.client.directive.html',
    scope:{id:"@"},
    link: function (scope, element, attrs) {
      Documents.get({ documentId: scope.id }).$promise.then(function (data) {
          scope.document = data;
          debugger;
      });
      
      
      // modelCtrl.$parsers.push(function (input) {
      //   return input ? input.toLowerCase() : '';
      // });
    }
  };
}]);
