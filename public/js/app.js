var app = angular.module('bibliolabs-viz', [
       // 'ui.mask',
       'ngAnimate',
       // 'adminControllers',
       // 'adminServices',
       'ui.bootstrap',
       'ngRoute']);

//var adminServices = angular.module('adminServices', ['ngResource']);
//var scrollService = angular.module('endless_scroll', []).directive('whenScrolled', function() {
var scrollService = app.directive('whenScrolled', function($document, $window) {
    return function(scope, elm, attr) {
        var raw = elm[0];
        
        //elm.bind( 'scroll', function() {
        $document.bind( 'scroll', function() {
          if( ($window.innerHeight + $window.scrollY) > getDocHeight() - 100) {
                scope.$apply(attr.whenScrolled);
          } /*
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
            */
        });
    };
});


function getDocHeight() {
    return Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    );
}


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


app.factory('ItemService', ['ItemProvider', function(itemProvider) {
  var itemSrv;
  var obj_by_id = {};

  itemSrv = function(callback) {
    itemProvider.get_data()
      .success(function(data) {
        for (var i=0; i<data.length; i++) {
          obj = data[i];
          if (! (obj.identificador in obj_by_id)) {
            obj_by_id[obj.identificador] = {};
          }
          obj_by_id[obj.identificador][obj.campo_nombre] = obj;
        }
        callback(obj_by_id);
      })
      .error(function(data) {
        console.log("Error getting data from milfs");
      });

  }
  //factory function body that constructs shinyNewServiceInstance
  return itemSrv;
}]);

app.factory('ItemProvider', function($http) {
  var milfs_url = "http://localhost:7888/api.php/json?";
  //the form id for the "Iniciativas Bibliotecas" form
  var form_id = "id=2";
  var data_url = milfs_url + form_id;
  return {
    get_data: function() {
      return $http.get(data_url);
    }
  };
});
/*
app.factory('ItemProvider', function() {
  return {
    get_data: function() {
      //create json here
      json = {"iniciativas":[{"nombre":"Viajeros del Agua","diapositiva":"http://4.bp.blogspot.com/-aFmDEU7P2c4/UBK_CVb06kI/AAAAAAAAABA/j2pG-AuaTp8/s640/598852_175085729288447_716591627_n.jpg","portada":"http://3.bp.blogspot.com/-QSzBelKhV78/U_td1brks1I/AAAAAAAAA-w/uf6avHYstv0/s1600/Iniciativa.jpg","descripcion":"Saberes y creaciones entorno a la quebrada La Quintana y otros cuerpos de água","descripcion_larga":""},{"nombre":"Huertas Y Járdines","diapositiva":"http://2.bp.blogspot.com/-UN1kvNsJUs8/U_tSj68H4gI/AAAAAAAAA-g/udYYWF3VtP4/s1600/Jardines%2By%2BHuertas.png","portada":"http://2.bp.blogspot.com/-J2Pn4dPqiOU/U_NK7b8Dy0I/AAAAAAAAA9I/u82MV60RqEo/s1600/Optical_illusion_disc_with_man_pumping_water.gif","descripcion":"Prácticas tradicionales para la siembra de huertas y jardines urbanos en el territorio","descripcion_larga":""}]};
      return json;
    }
  };
});
*/

app.controller("VitrinaCtrl", function VitrinaCtrl($scope, $http, ItemService, ItemProvider, $modal) {
  $scope.root = {};
  $scope.root.desc_visible = false;

  ItemService(function(iniciativas) {
    //console.log(iniciativas);
    $scope.root.todas_iniciativas = iniciativas;
    $scope.root.bibliotecas = [];
    $scope.root.publicos    = [];
    $scope.root.categorias  = [];

    var indexes     = [];
    var destacados  = [];
    var obj_array   = [];
    var por_bibs    = {};

    for (o in iniciativas) {
      var iniciativa = iniciativas[o];
      obj_array.push(iniciativa);
      if ((! iniciativa.hasOwnProperty('Titulo iniciativa')) || iniciativa['Titulo iniciativa'].contenido.length < 1) {
        delete iniciativas[o];
        continue;
      }
      if ( (iniciativa.hasOwnProperty('Biblioteca')) && ( $scope.root.bibliotecas.indexOf(iniciativa['Biblioteca'].contenido) == -1) ) {
        bib = iniciativa['Biblioteca'].contenido;
        $scope.root.bibliotecas.push(bib);
        if (!(bib in por_bibs)) {
          por_bibs[bib] = iniciativa; 
        }
      }
    }
    $scope.root.iniciativas = por_bibs;

    for (var a=0; a<6; a++) {
      var index = Math.floor(Math.random()*obj_array.length)
      while  (index in indexes) {
        index = Math.floor(Math.random()*obj_array.length)
      }
      indexes.push(index);
    }
    for (var b=0; b<indexes.length; b++) {
      destacados.push(obj_array[indexes[b]]);  
    }
    $scope.root.destacados = destacados;
  }, ItemProvider);
  //$scope.root.iniciativas = json.iniciativas;


  $scope.loadMore = function() {
    console.log("load more");
    var counter = 0;
    for (ini in $scope.root.todas_iniciativas) {
      if (ini in $scope.root.iniciativas) {
        continue;
      } else {
        $scope.root.iniciativas[ini] = $scope.root.todas_iniciativas[ini];
        counter += 1;
        if (counter == 8) {
          break;
        }
      }
    }
       
  };

  $scope.show_desc = function(iniciativa) {
  /***
    if ($scope.root.desc_visible) {
      $scope.root.desc_visible = false;
    } else {
      $scope.root.desc_visible = true;
   } 
  */
      $scope.root.desc_visible = true;
  }

  $scope.hide_desc = function(iniciativa) {
      $scope.root.desc_visible = false;

  }

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
