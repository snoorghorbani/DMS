'use strict';

// Documents controller
angular.module('documents').controller('DocumentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Documents', 'DocumentTypes', 'Tags',
  function ($scope, $stateParams, $location, Authentication, Documents, DocumentTypes, Tags) {
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
          //var tag;

          document.$update(function () {
              $location.path('documents/' + document._id);
          }, function (errorResponse) {
              $scope.error = errorResponse.data.message;
          });
      };

      // Find a list of Documents
      $scope.find = function () {
          $scope.documents = Documents.query();
          $scope.documents.$promise.then(function (data) {
              for (var i = 0, item; item = data[i]; i++) {
                  $scope.documents[i].key = {};
                  //item.value = {};
                  //for (var i in item.values) {
                  //    item.value[item.values[i][0]] = item.values[i][1];
                  //}
              }
          });
      };

      // Find existing Document
      $scope.findOne = function () {
          $scope.document = Documents.get({
              documentId: $stateParams.documentId
          });
          $scope.document.$promise.then(function (data) {
              //$scope.document.values = data.values || {};
              //$scope.document.type = data.type || {};
              $scope.selectedTags = $scope.selectedTags || [];
              $scope.document.tags = data.tags = data.tags || [];
              for (var i = 0; i < data.tags.length; i++)
                  $scope.selectedTags.push(data.tags[i].tagId);

              //$scope.document.key = {};
              //for (var i = 0; i < data.type.keys.length; i++)
              //    $scope.document.key[data.type.keys[i].name] = data.type.keys[i];
              //$scope.document.value = {};
              //for (var i in data.values) {
              //    $scope.document.value[data.values[i][0]] = data.values[i][1];
              //}
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
      $scope.tags = Tags.query();
      $scope.weights = [1, 2, 3, 5, 8, 13, 21];
      $scope.setWeight = function (tag, w) {
          debugger;
      }
      $scope.$watch("selectedTags", function (newValue, oldValue) {
          if (!newValue) return;
          //$scope.document.tags = [];
          var tag, documentTag;
          for (var i = 0; i < newValue.length; i++) {
              for (var i = 0; i < $scope.document.tags.length; i++) {
                  if ($scope.document.tags[i]._id == newValue[i]) {
                      documentTag = $scope.document.tags[i];
                  }
              }
              if (!documentTag) {
                  for (var j = 0; j < $scope.tags.length; j++) {
                      if ($scope.tags[j]._id == newValue[i]) {
                          tag = $scope.tags[j];
                          $scope.document.tags.push(new documentTagModel(tag));
                      }
                  }
              }
          }
      });
      $scope.disjoinTag = function (document, tag) {
          debugger;
      };
      $scope.selectFile = function (el) {
          var path = el.value;
          debugger
          var keyId = el.getAttribute("key-id");
          var keyName = el.getAttribute("key-name");
          $scope.document.values[keyId] = [keyName , path];
          $scope.$apply();
      }
  }
]);
