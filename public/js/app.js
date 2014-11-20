var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
var dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
var milfs_url = "http://localhost:7888/api.php/json?";
//var milfs_url = "http://www.bibliolabs.cc/milfs/api.php/json?";

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
  //the form id for the "Iniciativas Bibliotecas" form
  var form_id = "id=2";
  var data_url = milfs_url + form_id;
  return {
    get_data: function() {
      return $http.get(data_url);
    }
  };
});

app.controller("AgendaCtrl", function VitrinaCtrl($scope, $http, ItemService, ItemProvider, $modal) {
  $scope.root = {};
  $scope.root.filter_active = [] ;
  $scope.root.filter_items  = {};
  $scope.root.no_results    = false;

  //var milfs_url = "http://www.bibliolabs.cc/milfs/api.php/json?";
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
      $scope.root.all_agenda = sort_by_id(data);
      $scope.load_initial($scope.root.all_agenda);
    })
    .error(function(data) {
        console.log("Error getting agenda data from milfs");
    });
  
  $scope.isNotUndefined = function(item) {
    return item !== undefined;
  }

  $scope.get_day_of_month = function(fecha) {
    if (fecha) {
      return dias[fecha.getDay() +1];
    }
  }

  /******************************
    reset all filters 
  ******************************/
  $scope.reset_filters = function() {
    //console.log("reset filters"); 
    $scope.root.no_results = false;
    $scope.root.filter_active = [];
    $scope.root.filter_items = {};
    $scope.load_initial($scope.root.all_agenda);
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
      $scope.root.no_results    = false;
      $scope.load_initial($scope.root.all_agenda);
    } else {
      $scope.root.current_items = $scope.root.this_month; 
      for (var i=0; i<$scope.root.filter_active.length; i++) {
        var item = $scope.root.filter_active[i];
        $scope.do_filter(item, $scope.root.filter_items[item],$scope.root.current_items);
      }
    }
  }

  /******************************
    do_filter
  ******************************/
  $scope.do_filter = function(filter, filter_item, items) {
    var filtered = new Array(31); 
    var filter_counter = 0;

    for (var i=0; i<31; i++) {
      var day = items[i];
      if (day) {
        for (var y=0; y<day.length; y++) {
          var item = day[y];
          if (filtered[i] === undefined) {
            filtered[i]       = new Array();
            filtered[i].day   = items[i].day;
            filtered[i].fecha = items[i].fecha;
          }
          if (item[filter]) {
            if (item[filter].contenido == filter_item) {
              filtered[i].push(item);
              filter_counter += 1;
              continue;
            }
            if (item[filter].contenido.indexOf(filter_item) > -1 )  {
              filtered[i].push(item);
              filter_counter += 1;
              continue;
            }
          }
        }
      }
    }
    
    if (filter_counter == 0) {
      $scope.root.no_results = true;
    } else { 
      $scope.root.no_results = false;
      $scope.root.current_items = filtered;
      $scope.calc_cols(filter_counter, $scope.root.current_items);
    }
    $scope.root.filter_items[filter] = filter_item;
  }

  /******************************
    filter
  ******************************/
  $scope.filter = function(filter, item) {

    if ($scope.root.filter_active.indexOf(filter) == -1) {
      $scope.root.filter_active.push(filter);
    }
    
    var items = $scope.root.current_items;

    if ($scope.root.filter_active.length == 1) {
      items = $scope.root.this_month;
    }

    $scope.do_filter(filter, item, items);
  }

  /******************************
    load initial list of agenda items 
  ******************************/
  $scope.load_initial = function(items) {
    $scope.root.bibliotecas = [];
    $scope.root.zonas = [];
    $scope.root.cat   = [];
    var this_month = new Array(31);
    re = /^\d{4}.\d{1,2}.\d{1,2}$/;

    //var tmp = false;
    var total_items = 0;

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
        //tmp = it;
        this_month[day].push(it); 
        this_month[day].day = day +1;
        this_month[day].fecha = fecha;
        total_items += 1;
      }
      if ( (it.hasOwnProperty('Biblioteca')) && ( $scope.root.bibliotecas.indexOf(it['Biblioteca'].contenido) == -1) ) {
        bib = it['Biblioteca'].contenido;
        $scope.root.bibliotecas.push(bib);
      }
      if ( (it.hasOwnProperty('Zona de la ciudad')) && ( $scope.root.zonas.indexOf(it['Zona de la ciudad'].contenido) == -1) ) {
        zona = it['Zona de la ciudad'].contenido;
        $scope.root.zonas.push(zona);
      }
      if ( (it.hasOwnProperty('Categoría en la agenda')) && ( $scope.root.cat.indexOf(it['Categoría en la agenda'].contenido) == -1) ) {
        cat = it['Categoría en la agenda'].contenido;
        $scope.root.cat.push(cat);
      }
    }

    $scope.root.this_month = this_month;
    $scope.root.current_items = $scope.root.this_month;
    $scope.calc_cols(total_items, $scope.root.current_items); 
  }

  /******************************
    Evaluate how to build the agenda columns!
  ******************************/
  $scope.calc_cols = function(items, monthly) {
    //console.log(monthly);
    var min_per_cols = items / 4;
    var rest = items % 4;
    var index = 0;
    //var count = 0;
    var current_col = 0;
    $scope.root.items_per_col = [];
    //console.log("#######" + items);

    for (var i=0; i<31; i++) {
      var day = monthly[i];
      if (day) {
        //console.log(day);
        for (var y=0; y<day.length; y++, index++) {
          if (y == 0) {
            day[y].dia = i + 1;
            day[y].fecha = day.fecha;
          }
          if ($scope.root.items_per_col[current_col] === undefined) {
            $scope.root.items_per_col[current_col] = new Array();
          }
          //console.log("*****" + index);
          if (index < (min_per_cols -1)  ) {  
            if ($scope.root.items_per_col[current_col][index] === undefined) {
              $scope.root.items_per_col[current_col][index] = new Array();
            }
            //console.log("[current_col][index]: ["+current_col+"]["+index+"]" );
            $scope.root.items_per_col[current_col][index] = day[y];
            //count += 1;
            //console.log("=============" + count)
          } else {
            if (rest) {
              if ($scope.root.items_per_col[current_col][index] === undefined) {
                //console.log("ADDING ANOTHER ONE!!!! THERE'S REST!!!");
                $scope.root.items_per_col[current_col][index] = new Array();
                $scope.root.items_per_col[current_col][index] = day[y];
                //console.log("[current_col][index]: ["+current_col+"]["+index+"]" );
                //count += 1;
                //console.log("=============" + count)
                current_col += 1;
                index = -1;
              }
              rest -= 1;
              //console.log("rest: " + rest);
            } else {
              current_col += 1;
              if ($scope.root.items_per_col[current_col] === undefined) {
                $scope.root.items_per_col[current_col] = new Array();
              }
              index = 0;
              $scope.root.items_per_col[current_col][index] = day[y];
              //console.log("[current_col][index]: ["+current_col+"]["+index+"]" );
              //count += 1;
              //console.log("=============" + count)
            }
          }
        }          
      }
    }
    //$scope.root.items = this_month;
  }
});


app.controller("VitrinaCtrl", function VitrinaCtrl($scope, $http, ItemService, ItemProvider, $modal) {
  $scope.root = {};
  $scope.root.filter_active = [] ;
  $scope.root.filter_items  = {};
  $scope.root.no_results    = false;


  /******************************
    load initial list of initiatives 
  ******************************/
  $scope.load_initial = function(iniciativas) {
    $scope.root.destacados    = [];
    $scope.root.bibliotecas = [];
    $scope.root.publicos    = [];
    $scope.root.categorias  = [];
    $scope.root.visible_ids = [];

    var indexes     = [];
    var por_bibs    = [];

    for (o in iniciativas) {
      var iniciativa = iniciativas[o];
      if ((! iniciativa.hasOwnProperty('Titulo iniciativa')) || iniciativa['Titulo iniciativa'].contenido.length < 1) {
        delete iniciativas[o];
        continue;
      }
      if ( (iniciativa.hasOwnProperty('Biblioteca')) && ( $scope.root.bibliotecas.indexOf(iniciativa['Biblioteca'].contenido) == -1) ) {
        bib = iniciativa['Biblioteca'].contenido;
        $scope.root.bibliotecas.push(bib);
        if (!(bib in por_bibs)) {
          por_bibs.push(iniciativa); 
          $scope.root.visible_ids.push(o);
        }
      }
      if ( (iniciativa.hasOwnProperty('Publicos')) && ( $scope.root.publicos.indexOf(iniciativa['Publicos'].contenido) == -1) ) {
        pub = iniciativa['Publicos'].contenido;
        $scope.root.publicos.push(pub);
      }
      if ( (iniciativa.hasOwnProperty('Categoría iniciativas')) && ( $scope.root.categorias.indexOf(iniciativa['Categoría iniciativas'].contenido) == -1) ) {
        $scope.root.categorias.push(iniciativa['Categoría iniciativas'].contenido);
      }
      
      if ( (iniciativa.hasOwnProperty('Destacado') ) && (iniciativa['Destacado'].contenido == "Si") ) {
        $scope.root.destacados.push(iniciativa);
      }
    }
  
    $scope.root.iniciativas = por_bibs;
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
    //console.log("reset filters"); 
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
      $scope.root.no_results    = false;
      $scope.load_initial($scope.root.todas_iniciativas);
    } else {
      $scope.root.iniciativas = $scope.root.todas_iniciativas; 
      for (var i=0; i<$scope.root.filter_active.length; i++) {
        var item = $scope.root.filter_active[i];
        $scope.do_filter(item, $scope.root.filter_items[item],$scope.root.iniciativas);
      }
    }
  }

  /******************************
    do_filter
  ******************************/
  $scope.do_filter = function(filter, filter_item, items) {
    var filtered = [];

    for (o in items) { 
      if (items[o][filter]) {
        if (items[o][filter].contenido == filter_item) {
          filtered.push(items[o]);
          continue;
        }
        if ( items[o][filter].contenido.indexOf(filter_item) > -1 )  {
          filtered.push(items[o]);
          continue;
        }
      }
    }

    $scope.root.iniciativas = filtered;

    if (Object.keys(filtered).length == 0) {
      $scope.root.no_results = true;
    } else { 
      $scope.root.no_results = false;
    }
    $scope.root.filter_items[filter] = filter_item;
  }

  /******************************
    filter
  ******************************/
  $scope.filter = function(filter, item) {

    if ($scope.root.filter_active.indexOf(filter) == -1) {
      $scope.root.filter_active.push(filter);
    }

    var items = $scope.root.iniciativas;

    if ($scope.root.filter_active.length == 1) {
      items = $scope.root.todas_iniciativas;
    }

    $scope.do_filter(filter, item, items);
  }

  /******************************
    load more (scroll at end of 
    page) 
  ******************************/
  $scope.loadMore = function() {
    //console.log("load more");
    var counter = 0;
    for (ini in $scope.root.todas_iniciativas) {
      if ($scope.root.visible_ids.indexOf(ini) == -1) {
        $scope.root.iniciativas.push($scope.root.todas_iniciativas[ini]);
        $scope.root.visible_ids.push(ini);
        counter += 1;
        if (counter == 8) {
          return;
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

app.controller('VisualizationCtrl', function ($scope, $location) {
  
  $scope.active_visualization = "initiatives";
  if ($location.path().indexOf('agenda') > -1 ) {
    $scope.active_visualization = "agenda";
  }
    
  $scope.show_agenda = function() {
    window.location.href = '#/agenda';
    $scope.active_visualization = "agenda";
  }

  $scope.show_initiatives = function() {
    window.location.href = '#/index';
    $scope.active_visualization = "initiatives";
  }
});
