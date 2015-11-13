'use strict';

// Documents controller
angular.module('documents').controller('DocumentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Documents', 'DocumentTypes', 'Tags',
    function ($scope, $stateParams, $location, Authentication, Documents, DocumentTypes, Tags) {
        $scope.authentication = Authentication;
        $scope.values = {};
        $scope.selectedBatchFiles = [];
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
        $scope.batchCreate = function () {
            Documents.batchCreate({
                document: $scope.document,
                files: $scope.selectedBatchFiles
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

            //             if (!isValid) {
            // 
            $scope.$broadcast('show-errors-check-validity', 'documentForm');
            // 
            //                 return false;
            //             }

            var document = $scope.document;
            //var tag;
            for (var i in $scope.document.values)
                for (var j = $scope.document.values[i][1].length; j > 0; j--)
                    if ($scope.document.values[i][1][j] === '')
                        $scope.document.values[i][1].splice(j, 1);

            document.$update(function () {
                $location.path('documents/' + document._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Documents
        $scope.find = function () {
            Documents.query().$promise.then(function (data) {
                $scope.documents = [];
                for (var i = 0, item; item = data[i]; i++) {
                    $scope.documents.push(item);
                    //item.value = {};
                    //for (var i in item.values) {
                    //    item.value[item.values[i][0]] = item.values[i][1];
                    //}
                }
            });
        };
        $scope.documents = {};
        $scope.filter = function (documentTypeId) {
            Documents.query({ documentTypes: [documentTypeId] }).$promise.then(function (data) {
                $scope.documents[documentTypeId] = [];
                $scope.documents[documentTypeId] = data;
                // for (var i = 0, item; item = data.documents[i]; i++) {
                //     debugger
                //item.value = {};
                //for (var i in item.values) {
                //    item.value[item.values[i][0]] = item.values[i][1];
                //}
                // }
            });
        };
        $scope.instantiate = function () {
            $scope.document = new documentModel();
        };
        // Find existing Document
        $scope.findOne = function () {
            Documents.get({
                documentId: $stateParams.documentId
            }).$promise.then(function (data) {
                $scope.document = data;
                //$scope.document.values = data.values || {};
                //$scope.document.type = data.type || {};
                $scope.selectedTags = $scope.selectedTags || [];
                $scope.document.tags = data.tags = data.tags || [];
                for (var i = 0; i < data.tags.length; i++)
                    $scope.selectedTags.push(data.tags[i].tagId);
                data.values = data.values || {};
                for (var i = 0; i < data.type.keys.length; i++) {
                    if (!data.values[data.type.keys[i]._id]) {
                        $scope.document.values[data.type.keys[i]._id] = [data.type.keys[i].name, data.type.keys[i].default];
                    }
                    if (data.type.keys[i].type == "relation") {
                        // debugger;
                        $scope.documentRelationKey[data.type.keys[i].name] = data.values[data.type.keys[i]._id][1];
                    }
                }
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
                documentTag = null;
                for (var j = 0; j < $scope.document.tags.length; j++) {
                    if ($scope.document.tags[j].tagId == newValue[i]) {
                        documentTag = $scope.document.tags[j];
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

            for (var i = 0; i < $scope.document.tags.length; i++) {
                var exists = false;
                for (var j = 0; j < newValue.length; j++) {
                    if ($scope.document.tags[j].tagId == newValue[i]) {
                        exists = true;
                    }
                }
                if (!exists) {
                    $scope.document.tags.splice(i, 1);
                }
            }
        });
        $scope.disjoinTag = function (document, tag) {
        };
        $scope.selectFile = function (el) {
            var path = el.value;
            var files = [];
            for (var i = 0; i < el.files.length; i++) {
                var filePath = {
                    drive: path[0],
                    folderPath: path.substr(3, path.lastIndexOf('\\')),
                }
                filePath.name = el.files[i].name;
                filePath.size = el.files[i].size;
                filePath.type = el.files[i].type;
                filePath.path = filePath.drive + ':\\' + filePath.folderPath + '\\' + el.files[i].name;
                files.push(filePath);
            }
            return files;
            // var keyId = el.getAttribute("key-id");
            // var keyName = el.getAttribute("key-name");
            // var valueIndex = el.getAttribute("value-index");
            // Array.prototype.splice.apply($scope.document.values[keyId][1], [valueIndex, 1].concat(files));
            // $scope.$apply();
        }
        $scope.batchSelectFiles = function (el) {
            $scope.selectedBatchFiles = $scope.selectFile(el);
            
            // var keyId = el.getAttribute("key-id");
            // var keyName = el.getAttribute("key-name");
            // var valueIndex = el.getAttribute("value-index");
            // Array.prototype.splice.apply($scope.document.values[keyId][1], [valueIndex, 1].concat(files));
            $scope.$apply();
        };
        $scope.batchMode = function (key) {
            var inputs = event.target.parentNode.parentNode.querySelectorAll('input[type=text]');
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].disabled = true;
            };
        };
        $scope.addKeyValues = function (key) {
            $scope.document.values[key._id][1].push("");
        };
        $scope.activeDT = {};
        $scope.selectedType = '';
        $scope.loadDocumnetType = function () {
            DocumentTypes.get({
                documentTypeId: $scope.selectedType
            }).$promise.then(function (data) {
                $scope.document.type = data;

                $scope.document.values = $scope.document.values || {};
                for (var i = 0; i < data.keys.length; i++) {
                    if (!$scope.document.values[data.keys[i]._id]) {
                        $scope.document.values[data.keys[i]._id] = [data.keys[i].name, data.keys[i].default];
                    }
                }
            });
        };
        $scope.documentRelationKey = {};
        $scope.changeRelation = function (value, test, el) {
            var temp = {};
            var keyId = el.parentNode.parentNode.parentNode.dataset.keyId;
            var relations = $scope.document.values[keyId][1]; 
            // $scope.document.values[keyId][1] = $scope.document.values[keyId][1] || [];
            if (relations.indexOf(value) === -1)
                relations.push(value);
            $scope.document.values[keyId][1] = relations;

            $scope.$apply();
        };
    }
]);
function performClick(elemId) {
    var elem = document.getElementById(elemId);
    if (elem && document.createEvent) {
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, false);
        elem.dispatchEvent(evt);
    }
}