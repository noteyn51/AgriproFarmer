angular.module('app')
.directive('uppercased', function() {
  return {
      require: 'ngModel',        
      link: function(scope, element, attrs, modelCtrl) {
          modelCtrl.$parsers.push(function(input) {
              return input ? input.toUpperCase() : "";
          });
          element.css("text-transform","uppercase");
      }
  };
})

.directive('rotate', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(attrs.degrees, function (rotateDegrees) {
                

                var r = 'rotate(' + rotateDegrees + 'deg)';
                element.css({
                    '-moz-transform': r,
                    '-webkit-transform': r,
                    '-o-transform': r,
                    '-ms-transform': r,
                    transform: r,
                    'margin-top' : '20px'
                });
                if(r == "rotate(0deg)" || r == "rotate(180deg)"){
                	element.css('margin-top',0);
                }


            });
        }
    }
})
.directive('ionRadioFix', function() {
    return {
      restrict: 'E',
      replace: true,
      require: '?ngModel',
      transclude: true,
      template:
        '<label class="item item-radio">' +
          '<input type="radio" name="radio-group">' +
          '<div class="radio-content">' +
            '<div class="item-content disable-pointer-events" ng-transclude></div>' +
            '<i class="radio-icon disable-pointer-events icon ion-checkmark"></i>' +
          '</div>' +
        '</label>',
  
      compile: function(element, attr) {
        if (attr.icon) {
          var iconElm = element.find('i');
          iconElm.removeClass('ion-checkmark').addClass(attr.icon);
        }
  
        var input = element.find('input');
        angular.forEach({
            'name': attr.name,
            'value': attr.value,
            'disabled': attr.disabled,
            'ng-value': attr.ngValue,
            'ng-model': attr.ngModel,
            'ng-disabled': attr.ngDisabled,
            'ng-change': attr.ngChange,
            'ng-required': attr.ngRequired,
            'required': attr.required
        }, function(value, name) {
          if (angular.isDefined(value)) {
              input.attr(name, value);
            }
        });
  
        return function(scope, element, attr) {
          scope.getValue = function() {
            return scope.ngValue || attr.value;
          };
        };
      }
    };
  });