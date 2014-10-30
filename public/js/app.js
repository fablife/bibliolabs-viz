var app = angular.module('bibliolabs-viz', [
       // 'ui.mask',
       'ngAnimate',
       // 'adminControllers',
       // 'adminServices',
       'ui.bootstrap',
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
      json = {"iniciativas":[{"nombre":"Viajeros del Agua","diapositiva":"http://4.bp.blogspot.com/-aFmDEU7P2c4/UBK_CVb06kI/AAAAAAAAABA/j2pG-AuaTp8/s640/598852_175085729288447_716591627_n.jpg","portada":"http://3.bp.blogspot.com/-QSzBelKhV78/U_td1brks1I/AAAAAAAAA-w/uf6avHYstv0/s1600/Iniciativa.jpg","descripcion":"Saberes y creaciones entorno a la quebrada La Quintana y otros cuerpos de água","descripcion_larga":""},{"nombre":"Huertas Y Járdines","diapositiva":"http://2.bp.blogspot.com/-UN1kvNsJUs8/U_tSj68H4gI/AAAAAAAAA-g/udYYWF3VtP4/s1600/Jardines%2By%2BHuertas.png","portada":"http://2.bp.blogspot.com/-J2Pn4dPqiOU/U_NK7b8Dy0I/AAAAAAAAA9I/u82MV60RqEo/s1600/Optical_illusion_disc_with_man_pumping_water.gif","descripcion":"Prácticas tradicionales para la siembra de huertas y jardines urbanos en el territorio","descripcion_larga":""}]};
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


app.controller("VitrinaCtrl", function VitrinaCtrl($scope, $http, ItemService, ItemProvider, $modal) {
  $scope.root = {};
  json = ItemService(ItemProvider);
  $scope.root.iniciativas = json.iniciativas;

  $scope.show_detail = function(iniciativa) {
    $scope.root.selected_iniciativa = iniciativa;
    $scope.open('lg'); 
  }

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'partials/iniciativa',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.root.selected_iniciativa;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      //$log.info('Modal dismissed at: ' + new Date());
    });
  };

});


app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.iniciativa = items;
  $scope.selected = {
  //  item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
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


app.controller('CarouselIniciativasCtrl', function ($scope) {
  $scope.myInterval = 5000;
});
