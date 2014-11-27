var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
var dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
//var milfs_url = "http://localhost:7888/api.php/json?";
var milfs_url = "http://www.bibliolabs.cc/milfs/api.php/json?";

var app = angular.module('bibliolabs-viz', [
       'ngAnimate',
       'ui.bootstrap',
       'ngRoute']);

var scrollService = app.directive('whenScrolled', function($document, $window) {
    return function(scope, elm, attr) {
        var raw = elm[0];
        
        $document.bind( 'scroll', function() {
          if( ($window.innerHeight + $window.scrollY) > getDocHeight() - 100) {
                scope.$apply(attr.whenScrolled);
          } 
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
      })./*
      when('/agenda', {
        templateUrl: 'partials/agenda',
        controller: 'AgendaCtrl'
      }).*/
      when('/dashboard', {
        templateUrl: 'partials/dashboard',
        controller: 'DashboardCtrl'
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
    obj_by_id[obj.identificador][obj.id_campo] = obj;
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

/*************************************
  Dashboard Controller
************************************/
app.controller("DashboardCtrl", function DashboardCtrl($scope, $http, ItemService, ItemProvider, $modal) {
  $scope.root = {};

  //var wiki_url = "http://wiki.bibliolabs.cc/feed.php?type=atom2&num=5";
  var wiki_url ="/get_wiki_data";

  $http.get(wiki_url).success(function(data) {
    var x2js = new X2JS();
    json_data = x2js.xml_str2json(data);
    $scope.root.wiki = json_data.rss.channel;
    console.log($scope.root.wiki);
  }).error(function(data) {
    console.log("Could not get RSS from wiki!");
  });

  $scope.set_item_content_visible = function(item) {
    item['content_visible'] = true;
    console.log(item);
  }

  $scope.show = function(item) {
    alert(item.content_visible);
  }
});
  


app.controller("AgendaCtrl", function AgendaCtrl($scope, $http, ItemService, ItemProvider, $modal) {
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

var id_campo = {};
id_campo.estado     = 24;
id_campo.titulo     = 19;
id_campo.publicos   = 27;
id_campo.biblioteca = 20;
id_campo.categoria  = 25;
id_campo.destacado  = 55;
id_campo.documentacion = 30;
id_campo.etiquetas  = 26;
id_campo.portada    = 32;
id_campo.correo     = 15;
id_campo.telefono   = 6;
id_campo.espacios_biblioteca = 46;
id_campo.medio_principal = 31;
id_campo.desc_breve = 21;
id_campo.desc_larga = 22;

app.controller("VitrinaCtrl", function VitrinaCtrl($scope, $http, ItemService, ItemProvider, $modal) {
  $scope.root = {};
  $scope.root.filter_active = [] ;
  $scope.root.filter_items  = {};
  $scope.root.no_results    = false;

  $scope.id_campo = {};

  /******************************
    load initial list of initiatives 
  ******************************/
  $scope.load_initial = function(iniciativas) {
    $scope.root.destacados  = [];
    $scope.root.bibliotecas = [];
    $scope.root.publicos    = [];
    $scope.root.categorias  = [];
    $scope.root.visible_ids = [];

    var indexes     = [];
    var por_bibs    = [];
    var por_bibs_o  = {};

    $scope.id_campo = id_campo;

    for (o in iniciativas) {
      var iniciativa = iniciativas[o];

      if ( (iniciativa.hasOwnProperty($scope.id_campo.estado)) && (iniciativa[$scope.id_campo.estado].contenido == "Inactivo") ) {
        delete iniciativas[o];
        continue;
      }

      if ( (! iniciativa.hasOwnProperty($scope.id_campo.titulo)) || (iniciativa[$scope.id_campo.titulo].contenido.length  < 1) ) {
        delete iniciativas[o];
        continue;
      }

      if ( iniciativa.hasOwnProperty($scope.id_campo.biblioteca)  )  {
        bib = iniciativa[$scope.id_campo.biblioteca].contenido;
        if ( $scope.root.bibliotecas.indexOf(iniciativa[$scope.id_campo.biblioteca].contenido) == -1 ) {
          $scope.root.bibliotecas.push(bib);
        }
        if (!(bib in por_bibs_o)) {
          por_bibs_o[bib] = iniciativa;
        } else {
            var ini = por_bibs_o[bib];
            if (ini[$scope.id_campo.biblioteca].contenido == bib) {
              if (ini[$scope.id_campo.biblioteca]['timestamp'] < iniciativa[$scope.id_campo.biblioteca]['timestamp']) {
                por_bibs_o[bib] = iniciativa;
              }
            }
        }
      }

      if ( (iniciativa.hasOwnProperty($scope.id_campo.publicos)) && ($scope.root.publicos.indexOf(iniciativa[$scope.id_campo.publicos].contenido) == -1 ) ) {
        pub = iniciativa[$scope.id_campo.publicos].contenido;
        $scope.root.publicos.push(pub);
      }

      if ( (iniciativa.hasOwnProperty($scope.id_campo.categoria)) && ($scope.root.categorias.indexOf(iniciativa[$scope.id_campo.categoria].contenido) == -1 ) ) {
        $scope.root.categorias.push(iniciativa[$scope.id_campo.categoria].contenido);
      }
      
      if ( (iniciativa.hasOwnProperty($scope.id_campo.destacado)) && (iniciativa[$scope.id_campo.destacado].contenido == "Si" ) ) {
        $scope.root.destacados.push(iniciativa);
      }

    }

    for (b in por_bibs_o) {
      var o = por_bibs_o[b];
      por_bibs.push(o);
      $scope.root.visible_ids.push(o[$scope.id_campo.biblioteca].identificador);
    }

    $scope.root.iniciativas = por_bibs;
  }

  
  /******************************
   After cards are loaded, check with server on new ones 
  ******************************/
  $scope.check_new_items = function() {
    for (var i=0; i<$scope.root.iniciativas.length; i++) {
      var ini = $scope.root.iniciativas[i];
      $http.post('/check_latest',{id: ini[$scope.id_campo.biblioteca].identificador, timestamp: ini[$scope.id_campo.biblioteca].timestamp})
        .success(function(data,stat,headers,conf) {
          //check if this is a new iniciative for this library
          //200 yes is new, 304 Not Modified
          if (stat == 200) {
            for (var k=0; k<$scope.root.iniciativas.length; k++) {
              var nueva = $scope.root.iniciativas[k];
              if (nueva[$scope.id_campo.biblioteca].identificador == data) {
                nueva.nueva = true;
                return;
              }
            }
          }
        })
        .error(function(data,stat,headers,conf) {
          if (stat == 304) {
            //console.log("not modified");
          } else {
            console.log("Error evaluando check_latest!");
          }
        });
    }
  }
  
  /******************************
    callback from ItemService
  ******************************/
  ItemService(function(iniciativas) {
    //console.log(iniciativas);
    $scope.root.todas_iniciativas = iniciativas;
    $scope.load_initial(iniciativas);
    $scope.check_new_items();
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
  $scope.id_campo   = id_campo;

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
