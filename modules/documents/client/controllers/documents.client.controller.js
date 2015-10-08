'use strict';

// Documents controller
angular.module('documents').controller('DocumentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Documents', 'DocumentTypes',
  function ($scope, $stateParams, $location, Authentication, Documents, DocumentTypes) {
      $scope.authentication = Authentication;
      $scope.values = {};
      // Create new Document
      $scope.create = function (isValid) {
          $scope.error = null;

          if (!isValid) {
              $scope.$broadcast('show-errors-check-validity', 'documentForm');

              return false;
          }

          // Create new Document object
          var document = new Documents($scope.document);

          // Redirect after save
          document.$save(function (response) {
              $location.path('documents/' + response._id);

              // Clear form fields
              $scope.title = '';
              $scope.content = '';
          }, function (errorResponse) {
              $scope.error = errorResponse.data.message;
          });
      };

      // Remove existing Document
      $scope.remove = function (document) {
          if (document) {
              document.$remove();

              for (var i in $scope.documents) {
                  if ($scope.documents[i] === document) {
                      $scope.documents.splice(i, 1);
                  }
              }
          } else {
              $scope.document.$remove(function () {
                  $location.path('documents');
              });
          }
      };

      // Update existing Document
      $scope.update = function (isValid) {
          $scope.error = null;

          if (!isValid) {
              $scope.$broadcast('show-errors-check-validity', 'documentForm');

              return false;
          }

          var document = $scope.document;

          document.$update(function () {
              $location.path('documents/' + document._id);
          }, function (errorResponse) {
              $scope.error = errorResponse.data.message;
          });
      };

      // Find a list of Documents
      $scope.find = function () {
          $scope.documents = Documents.query();
      };

      // Find existing Document
      $scope.findOne = function () {
          $scope.document = Documents.get({
              documentId: $stateParams.documentId
          });
          $scope.document.$promise.then(function (data) {
              $scope.document.values = data.values || {};
              //$scope.document.type = data.type || {};
          });
      };

      // add new property to documnet
      $scope.addProperty = function () {
          $scope.document.keys.push(new keyModel({
              name: $scope.newProp.name,
              type: $scope.newProp.type,
              default: $scope.newProp.default,
          }));
      };

      $scope.changeDocumentType = function (type) {
          $scope.document.type = event.target.value;
      };

      $scope.documentTypes = DocumentTypes.query();
  }
]);
