var app = angular.module('bibliolabs-viz', [
       // 'ui.mask',
        'ngAnimate',
       // 'adminControllers',
       // 'adminServices',
       // 'ui.bootstrap',
        'ngRoute']);

//var adminServices = angular.module('adminServices', ['ngResource']);


app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/vitrina', {
        templateUrl: 'partials/vitrina',
        controller: 'VitrinaCtrl'
      }).
      when('/informes', {
        templateUrl: 'admin/partials/informes',
        controller: 'AdminCtrl'
      }).
      otherwise({
        redirectTo: '/index'
      });
}]);



app.controller("MenuCtrl", function MenuCtrl($scope, $http) {

  $scope.show_submenu = false; 
  $scope.animate_menu = function() {
    $scope.show_submenu = true;
  }

  $scope.hide_menu = function() {
    $scope.show_submenu = false;
  }

  $scope.logout = function() {
    location.href = "/logout";
  }
});

