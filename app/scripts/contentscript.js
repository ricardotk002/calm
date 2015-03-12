'use strict';

window.addEventListener('load', function() {
  var app = angular.module('InboxPeace', []);

  var html = document.querySelector('html');
  html.setAttribute('ng-app', '');
  html.setAttribute('ng-csp', '');

  var body = document.querySelector('body');
  body.setAttribute('ng-controller', 'MainController');
  app.controller('MainController', ['$scope', function($scope) {
    $scope.load = function() {
      console.log("hola!");
    };
  }]);

  var myDirective = document.createElement('div');
  myDirective.setAttribute('my-directive', '');
  body.appendChild(myDirective);

  var button = document.createElement('a');
  button.innerHTML = "Click Here!"
  button.setAttribute('ng-click', 'load()');
  document.querySelector(".aki").appendChild(button);

  app.directive('myDirective', function() {
    return {
      restrict: 'EA',
      replace: true,
      template: '<div class="inbox-peace">HOLA HOLA HOLA</div>'
    }
  });

  angular.bootstrap(html, ['InboxPeace'], []);
});