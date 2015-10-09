'use strict';

// Tags controller
angular.module('tags').controller('TagsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tags', 'Documents',
  function ($scope, $stateParams, $location, Authentication, Tags, Documents) {
      $scope.authentication = Authentication;
      $scope.values = {};
      // Create new Tag
      $scope.create = function (isValid) {
          $scope.error = null;

          if (!isValid) {
              $scope.$broadcast('show-errors-check-validity', 'tagForm');

              return false;
          }

          // Create new Tag object
          var tag = new Tags($scope.tag);

          // Redirect after save
          tag.$save(function (response) {
              $location.path('tags/' + response._id);

              // Clear form fields
              $scope.title = '';
              $scope.content = '';
          }, function (errorResponse) {
              $scope.error = errorResponse.data.message;
          });
      };

      // Remove existing Tag
      $scope.remove = function (tag) {
          if (tag) {
              tag.$remove();

              for (var i in $scope.tags) {
                  if ($scope.tags[i] === tag) {
                      $scope.tags.splice(i, 1);
                  }
              }
          } else {
              $scope.tag.$remove(function () {
                  $location.path('tags');
              });
          }
      };

      // Update existing Tag
      $scope.update = function (isValid) {
          $scope.error = null;

          if (!isValid) {
              $scope.$broadcast('show-errors-check-validity', 'tagForm');

              return false;
          }

          var tag = $scope.tag;

          tag.$update(function () {
              $location.path('tags/' + tag._id);
          }, function (errorResponse) {
              $scope.error = errorResponse.data.message;
          });
      };

      // Find a list of Tags
      $scope.find = function (criteria) {
          $scope.tags = Tags.query(criteria || {});
      };

      // Find existing Tag
      $scope.findOne = function () {
          $scope.tag = Tags.get({
              tagId: $stateParams.tagId
          });
          $scope.tag.$promise.then(function (data) {
              $scope.tag.values = data.values || {};
              //$scope.tag.type = data.type || {};
          });
      };

      // add new property to documnet
      $scope.addProperty = function () {
          $scope.tag.keys.push(new keyModel({
              name: $scope.newProp.name,
              type: $scope.newProp.type,
              default: $scope.newProp.default,
          }));
      };

      $scope.relatedDocument = [];
      $scope.findRelatedDocument = function (tag) {
          $scope.relatedDocument = Documents.query({ "tags.name": tag.name });
      }
  }
]);
