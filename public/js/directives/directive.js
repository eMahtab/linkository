var appDirectives=angular.module('app.directives',[]);

appDirectives.directive('tagInput', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			scope.inputWidth = 20;

			// Watch for changes in text field
			scope.$watch(attrs.ngModel, function(value) {
				if (value != undefined) {
					var tempEl = $('<span>' + value + '</span>').appendTo('body');
					scope.inputWidth = tempEl.width() + 35;
					tempEl.remove();
				}
			});

		}
	}
});



appDirectives.directive('tagInputField', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {

			element.bind('keyup', function(e) {
				var key = e.which;
				// Tab or Enter pressed
				if (key == 9 || key == 13) {
          console.log("Caught enter key");
					e.preventDefault();
					//scope.$apply(attrs.newTag);
				}
			});
		}
	}
});


appDirectives.directive('takeFocus', function($timeout) {
    return {
        restrict: 'AC',
        link: function(_scope, _element) {
            $timeout(function(){
                _element[0].focus();
            }, 0);
        }
    };
});
