'use strict';

angular.module('core').directive('checkbox', [
    function () {
        return {
            restrict: 'C',
            link: function postLink(scope, element, attrs) {
                // Checkbox directive logic
                // ...
                var checked;
                scope.$watch(attrs.ngModel, function (value) {
                    checked = value == true ? true : false;
                    $(element).checkbox(checked ? "set checked" : "set unchecked");
                });
                //var path = attrs.ngModel.split('.');
                //if (path.length == 1) {
                //    checked = scope[path[0]];
                //} else if (path.length == 2) {
                //    checked = scope[path[0]][path[1]];
                //} else if (path.length == 3) {
                //    checked = scope[path[0]][path[1]][path[2]];
                //}
                $(element).checkbox({
                    onChecked: function (value) {
                        var path = attrs.ngModel.split('.');
                        if (path.length == 1) {
                            scope[path[0]] = true;
                        } else if (path.length == 2) {
                            scope[path[0]][path[1]] = true;
                        } else if (path.length == 3) {
                            scope[path[0]][path[1]][path[2]] = true;
                        }

                        if (this.name) {
                            var otherRadioButtons = document.body.querySelectorAll('[name=' + this.name + ']');
                            for (var i = 0; i < otherRadioButtons.length; i++) {
                                if (otherRadioButtons[i] == this) continue;

                                var selfScope = angular.element(otherRadioButtons[i]).scope();
                                if (path.length == 1) {
                                    selfScope[path[0]] = false;
                                } else if (path.length == 2) {
                                    selfScope[path[0]][path[1]] = false;
                                } else if (path.length == 3) {
                                    selfScope[path[0]][path[1]][path[2]] = false;
                                }
                            }
                            scope.$apply();
                        }
                    },
                    onUnchecked: function (value) {
                        var path = attrs.ngModel.split('.');
                        if (path.length == 1) {
                            scope[path[0]] = false;
                        } else if (path.length == 2) {
                            scope[path[0]][path[1]] = false;
                        } else if (path.length == 3) {
                            scope[path[0]][path[1]][path[2]] = false;
                        }
                        scope.$apply();
                    },
                });
            }
        };
    }
]);