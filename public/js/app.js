var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
var dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

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
      when('/agenda', {
        templateUrl: 'partials/agenda',
        controller: 'AgendaCtrl'
      }).
      when('/informes', {
        templateUrl: 'admin/partials/informes',
        controller: 'AdminCtrl'
      }).
      otherwise({
        redirectTo: '/index'
      });
}]);

function sort_by_id(data) {
  var obj_by_id = {};

  for (var i=0; i<data.length; i++) {
    obj = data[i];
    if (! (obj.identificador in obj_by_id)) {
      obj_by_id[obj.identificador] = {};
    }
    obj_by_id[obj.identificador][obj.campo_nombre] = obj;
  }

  return obj_by_id;
}

app.factory('ItemService', ['ItemProvider', function(itemProvider) {
  var itemSrv;

  itemSrv = function(callback) {
    itemProvider.get_data()
      .success(function(data) {
        //console.log(data);
        callback(sort_by_id(data));
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

app.controller("AgendaCtrl", function VitrinaCtrl($scope, $http, ItemService, ItemProvider, $modal) {
  $scope.root = {};

  var milfs_url = "http://bibliolabs.cc/milfs/api.php/json?";
  //the form id for the "Agenda" form
  var form_id = "id=6";
  var data_url = milfs_url + form_id;

  var today = new Date();
  $scope.year    = today.getFullYear();
  $scope.wmonth  = meses[today.getMonth()];
  $scope.month   = today.getMonth();
  $scope.day     = today.getDate();
  $scope.weekday = dias[today.getDay() +1 ];

  $scope.root.no_results = false;

  $http.get(data_url)
    .success(function(data) {
      //console.log(data);
      $scope.load_initial(sort_by_id(data));
    })
    .error(function(data) {
        console.log("Error getting agenda data from milfs");
    });
  
  $scope.isNotUndefined = function(item) {
    return item !== undefined;
  }

  $scope.get_day_of_month = function(fecha) {
    return dias[fecha.getDay()];
  }
  /******************************
    load initial list of agenda items 
  ******************************/
  $scope.load_initial = function(items) {
    var this_month = new Array(31);;
    re = /^\d{4}-\d{1,2}-\d{1,2}$/;

    for (o in items) {
      var it = items[o];
      if (! it.hasOwnProperty('Actividad'))  {
        delete items[o];
      } 
      if (it.hasOwnProperty('Fecha') && (it['Fecha'].contenido.match(re))) {
        var fecha = new Date(it['Fecha'].contenido);
        var day = fecha.getDate();
        var month = fecha.getMonth();
        if (month != $scope.month) {
          continue;
        }
        if (this_month[day] === undefined) {
          this_month[day] = [];
        }
        this_month[day].push(it); 
        this_month[day].day = day;
        this_month[day].fecha = fecha;
      }
    }
  
    $scope.root.items = this_month;
    console.log(this_month);
  }
});


app.controller("VitrinaCtrl", function VitrinaCtrl($scope, $http, ItemService, ItemProvider, $modal) {
  $scope.root = {};
  $scope.root.filter_active = [] ;
  $scope.root.filter_items = {};
  $scope.root.no_results = false;


  /******************************
    load initial list of initiatives 
  ******************************/
  $scope.load_initial = function(iniciativas) {
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
      if ( (iniciativa.hasOwnProperty('Publicos')) && ( $scope.root.publicos.indexOf(iniciativa['Publicos'].contenido) == -1) ) {
        pub = iniciativa['Publicos'].contenido;
        $scope.root.publicos.push(pub);
      }
    }
    $scope.root.iniciativas = por_bibs;
  
    if (obj_array.length > 0) {
      for (var a=0; a<6; a++) {
        var index = Math.floor(Math.random()*obj_array.length)
        while  (indexes.indexOf(index) > -1) {
          index = Math.floor(Math.random()*obj_array.length)
        }
        indexes.push(index);
      }
      for (var b=0; b<indexes.length; b++) {
        destacados.push(obj_array[indexes[b]]);  
      }
    }
    $scope.root.destacados = destacados;

  }

  /******************************
    callback from ItemService
  ******************************/
  ItemService(function(iniciativas) {
    //console.log(iniciativas);
    $scope.root.todas_iniciativas = iniciativas;
    $scope.load_initial(iniciativas);
  }, ItemProvider);


  /******************************
    reset all filters 
  ******************************/
  $scope.reset_filters = function() {
    console.log("reset fileters"); 
    $scope.root.no_results = false;
    $scope.root.filter_active = [];
    $scope.root.filter_items = {};
    $scope.load_initial($scope.root.todas_iniciativas);
  }

  /******************************
    reset specific filter 
  ******************************/
  $scope.reset_filter = function(filter) {
    delete $scope.root.filter_items[filter];  

    for (var i=0; i<$scope.root.filter_active.length; i++) {
      var item = $scope.root.filter_active[i];
      if (item == filter) {
        $scope.root.filter_active.splice(i, 1);
        break;
      } 
    }
    
    if ($scope.root.filter_active.length == 0) {
      $scope.load_initial($scope.root.todas_iniciativas);
    } else {
      for (var i=0; i<$scope.root.filter_active.length; i++) {
        var item = $scope.root.filter_active[i];
        $scope.filter(item, $scope.root.filter_items[item]);
      }
    }
  }

  /******************************
    do filter
  ******************************/
  $scope.filter = function(filter, item) {
    var filtered = [];
    var iniciativas = $scope.root.todas_iniciativas;
    
    if ((! $scope.root.no_results) && ($scope.root.filter_active.length > 0) && ( $scope.root.filter_active.indexOf(filter) == -1 )  ) {
      console.log("filtering on existing");
      iniciativas = $scope.root.iniciativas;
    } else {
      console.log("filtering all");
    }

    for (o in iniciativas) { 
      if (iniciativas[o][filter] && iniciativas[o][filter].contenido == item) {
        filtered.push(iniciativas[o]);
        continue;
      }
      if (iniciativas[o][filter] && ( iniciativas[o][filter].contenido.indexOf(item) > -1) ) {
        filtered.push(iniciativas[o]);
        continue;
      }
    }

    $scope.root.iniciativas = filtered;
    if (Object.keys(filtered).length == 0) {
      $scope.root.no_results = true;
      //console.log("no results");
    } 
    if ($scope.root.filter_active.indexOf(filter) == -1) {
      $scope.root.filter_active.push(filter);
    }
    $scope.root.filter_items[filter] = item;
    console.log($scope.root.filter_items);
  }

  /******************************
    load more (scroll at end of 
    page) 
  ******************************/
  $scope.loadMore = function() {
    //console.log("load more");
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


  /******************************
    show detail of an initiative
  ******************************/
  $scope.show_detail = function(iniciativa) {
    $scope.root.selected_iniciativa = iniciativa;
    $scope.open('lg'); 
  }

  /******************************
    do filter
  ******************************/
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

app.controller('VisualizationCtrl', function ($scope) {
  $scope.active_visualization = "initiatives";

  $scope.show_agenda = function() {
    window.location.href = '#/agenda';
    $scope.active_visualization = "agenda";
  }

  $scope.show_initiatives = function() {
    window.location.href = '#/index';
    $scope.active_visualization = "initiatives";
  }
});
