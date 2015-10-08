'use strict';

angular.module('core').directive('dropdown', [
	function () {
	    return {
	        restrict: 'C',
	        link: function postLink(scope, element, attrs) {
	            var checked;
	            scope.$watch(attrs.ngModel, function (value) {
	                if(!value) return;
                    $(element).dropdown("set selected", value);
	            });

	            $(element).dropdown({
	                onChange: function (value, test, el) {
	                    var path = attrs.ngModel.split('.');
	                    if (path.length == 1) {
	                        scope[path[0]] = value;
	                    } else if (path.length == 2) {
	                        scope[path[0]][path[1]] = value;
	                    } else if (path.length == 3) {
	                        scope[path[0]][path[1]][path[2]] = value;
	                    }
	                    scope.$apply();
	                }
	            });

	        }
	    };
	}
]);