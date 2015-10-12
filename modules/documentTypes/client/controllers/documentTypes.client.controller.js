'use strict';

// DocumentTypes controller
angular.module('documentTypes').controller('DocumentTypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'DocumentTypes', 'Documents',
  function ($scope, $stateParams, $location, Authentication, DocumentTypes, Documents) {
      $scope.authentication = Authentication;

      // Create new DocumentType
      $scope.create = function (isValid) {
          $scope.error = null;

          if (!isValid) {
              $scope.$broadcast('show-errors-check-validity', 'documentTypeForm');

              return false;
          }

          // Create new DocumentType object
          var documentType = new DocumentTypes({
              title: this.title,
              content: this.content
          });

          // Redirect after save
          documentType.$save(function (response) {
              $location.path('documentTypes/' + response._id);

              // Clear form fields
              $scope.title = '';
              $scope.content = '';
          }, function (errorResponse) {
              $scope.error = errorResponse.data.message;
          });
      };

      // Remove existing DocumentType
      $scope.remove = function (documentType) {
          if (documentType) {
              documentType.$remove();

              for (var i in $scope.documentTypes) {
                  if ($scope.documentTypes[i] === documentType) {
                      $scope.documentTypes.splice(i, 1);
                  }
              }
          } else {
              $scope.documentType.$remove(function () {
                  $location.path('documentTypes');
              });
          }
      };

      // Update existing DocumentType
      $scope.update = function (isValid) {
          $scope.error = null;

          if (!isValid) {
              $scope.$broadcast('show-errors-check-validity', 'documentTypeForm');

              return false;
          }

          var documentType = $scope.documentType;

          documentType.$update(function () {
              $location.path('documentTypes/' + documentType._id);
          }, function (errorResponse) {
              $scope.error = errorResponse.data.message;
          });
      };

      // Find a list of DocumentTypes
      $scope.find = function () {
          $scope.documentTypes = DocumentTypes.query();
      };

      // Find existing DocumentType
      $scope.findOne = function () {
          $scope.documentType = DocumentTypes.get({
              documentTypeId: $stateParams.documentTypeId
          });
      };

      // add new property to documnetType
      $scope.addProperty = function () {
          $scope.documentType.keys.push(new keyModel({
              name: $scope.newProp.name,
              type: $scope.newProp.type,
              default: $scope.newProp.default,
          }));
      };

      $scope.changeNewkeyType = function (type) {
          $scope.newProp.type = type;
      };

      $scope.relatedDocument = [];
      $scope.findRelatedDocument = function () {
          $scope.relatedDocument = Documents.query({ "type": $stateParams.documentTypeId });
      }
      $scope.fieldTypes = ['number', 'text', 'string', 'boolean', 'date', 'regex', 'file', 'relation'];
      $scope.addDocumnetTypeToFieldTypes = function () {
          $scope.find();
          //$scope.documentTypes.$promise.then(function (data) {
          //    for (var i = 0; i < data.length; i++) {
          //        $scope.fieldTypes.push(data[i].title);
          //    }
          //});
      };
  }
]);
