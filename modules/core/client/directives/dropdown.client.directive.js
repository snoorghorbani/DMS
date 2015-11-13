'use strict';

angular.module('core').directive('dropdown', ['$parse',
	function ($parse) {
	    return {
	        restrict: 'C',
            priority:-999,
	        link: function postLink(scope, element, attrs) {
	            var checked;
	            var firstTime = true;
	            attrs.ngModel && scope.$watch(attrs.ngModel, function (value) {
	                //if (!value || !firstTime) return;
	                if (!value) return;
	                firstTime = false;
	                setTimeout(function () {
                    $(element).dropdown("set selected", value);
	                }, 333);
	            });

	            $(element).dropdown({
	                onChange: function (value, test, el) {
	                    if (!attrs.ngModel) return true;
						var getter = $parse(attrs.ngModel);
						var setter = getter.assign;
						setter(scope,value);
	                    // var path = attrs.ngModel.split('.');
	                    // if (path.length == 1) {
	                    //     scope[path[0]] = value;
	                    // } else if (path.length == 2) {
	                    //     scope[path[0]][path[1]] = value;
	                    // } else if (path.length == 3) {
	                    //     scope[path[0]][path[1]][path[2]] = value;
	                    // }
	                    scope.$apply();
						
						if(attrs.ngChange)
							scope[attrs.ngChange](value, test, el[0]);
	                }
	            });

	        }
	    };
	}
]);