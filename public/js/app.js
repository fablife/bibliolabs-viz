var app = angular.module('bibliolabs-viz', [
       // 'ui.mask',
        'ngAnimate',
       // 'adminControllers',
       // 'adminServices',
       // 'ui.bootstrap',
        'ngRoute']);

//var adminServices = angular.module('adminServices', ['ngResource']);

app.factory('ItemService', ['ItemProvider', function(itemProvider) {
  var itemSrv;

  itemSrv = function() {
    json = itemProvider.get_data();
    return json;
  }
  //factory function body that constructs shinyNewServiceInstance
  return itemSrv;
}]);

app.factory('ItemProvider', function() {
  return {
    get_data: function() {
      //create json here
      json = {"iniciativas":[{"nombre":"Viajeros del Agua","portada":"http://3.bp.blogspot.com/-QSzBelKhV78/U_td1brks1I/AAAAAAAAA-w/uf6avHYstv0/s1600/Iniciativa.jpg","descripcion":"Saberes y creaciones entorno a la quebrada La Quintana y otros cuerpos de água","descripcion_larga":""},{"nombre":"Huertas Y Járdines","portada":"http://2.bp.blogspot.com/-J2Pn4dPqiOU/U_NK7b8Dy0I/AAAAAAAAA9I/u82MV60RqEo/s1600/Optical_illusion_disc_with_man_pumping_water.gif","descripcion":"Prácticas tradicionales para la siembra de huertas y jardines urbanos en el territorio","descripcion_larga":""}]};
      return json;
    }
  };
});

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/index', {
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


app.controller("VitrinaCtrl", function VitrinaCtrl($scope, $http, ItemService, ItemProvider) {
  $scope.root = {};
  json = ItemService(ItemProvider);
  $scope.root.iniciativas = json.iniciativas;
});

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

