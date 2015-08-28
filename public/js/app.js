var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
var dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
//var milfs_url = "http://localhost:7888/api.php/json?";
//var milfs_url = "http://www.bibliolabs.cc/milfs/api.php/json?";
var milfs_url = "http://localhost/api.php/json?";
var plan_de_trabajo_2015_form_id = "id=2"; 

var app = angular.module('bibliolabs-viz', [
       'ngAnimate',
       'ui.bootstrap',
       'ngRoute']);

app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

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
      when('/inicio', {
        templateUrl: 'partials/inicio',
        controller: 'InicioCtrl'
      }).
      when('/tools', {
        templateUrl: 'partials/tools',
        controller: 'ToolsCtrl'
      })./*
      when('/pdt', {
        templateUrl: 'partials/plan_de_trabajo',
        controller: 'PdtCtrl'
      }).*/
      when('/vitrina', {
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
        redirectTo: '/inicio'
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
        console.log(data);
        console.log("Error getting data from milfs");
      });

  }
  //factory function body that constructs shinyNewServiceInstance
  return itemSrv;
}]);

app.factory('ItemProvider', function($http) {
  //the form id for the "Iniciativas Bibliotecas" form
  //var form_id = plan_de_trabajo_2015_form_id;
  //var data_url = milfs_url + form_id;
  var data_url = "/get_api_data";
  return {
    get_data: function() {
      return $http.get(data_url);
    }
  };
});

/*************************************
  Tools Controller
************************************/
app.controller("ToolsCtrl", function Tools($scope, $http ) {

  $scope.root = {};
  mg = {
    title: "Gestor de contenidos mediáticos mediagoblin",
    desc: "Sirve para gestionar audio, video, photos. Es un híbrido entre un flickr y un youtube - pero con software libre.",
    manual: "http://wiki.bibliolabs.cc/tdcayc:infraestructura:manuales:mediagoblin",
    link: "http://media.bibliolabs.cc",
    thumb: "/images/mediagoblin.png",
    vendor_link: "http://mediagoblin.org"
  };
  sympa = {
    title: "Lista de correo sympa",
    desc: "Sirve para la interacción por correo electrónico entre los participantes. Cada participante puede escribir un correo a la lista, cada participante recibe todos los correos de la lista",
    manual: "http://wiki.bibliolabs.cc/tdcayc:infraestructura:manuales:sympa",
    link: "http://listas.bibliolabs.cc",
    thumb: "/images/sympa.png",
    vendor_link: "http://www.sympa.org"
  };
  limesurvey = {
    title: "Herramienta de encuestas LimeSurvey",
    desc: "Herramienta para encuestas. La usamos para recopilar la retroalimentación (evaluación) de los talleres por los participantes. Contiene herramientas de estadísticas y visualización de los resultados.",
    manual: "http://wiki.bibliolabs.cc/tdcayc:infraestructura:manuales:limesurvey",
    thumb: "/images/limesurvey.png",
    link: "http://www.bibliolabs.cc/encuestas/",
    vendor_link: "http://www.limesurvey.org/"
  };
  hotglue = {
    title: "Constructor de páginas web hotglue",
    desc: "Hotglue es un entorno para la creación rápida de páginas web sin necesidad de conocimiento de programación.",
    manual: "http://wiki.bibliolabs.cc/tdcayc:instructivos:hotglue",
    //link: "http://hotglue.bibliolabs.cc/",
    link: "http://wiki.bibliolabs.cc/tdcayc:talleres:resultados:hotglue",
    thumb: "/images/hotglue.png",
    vendor_link: "http://hotglue.me/"
  };
  wiki = {
    title: "Wiki (Dokuwiki)",
    desc: "La wiki es la herramienta principal de gestión de conocimiento para el proyecto. Wikipedia está construida sobre un wiki. En bibliolabs usamos dokuwiki, pero comunicando los mismos conceptos básicos de uso y edición de un wiki.",
    manual: "http://www.dokuwiki.org/",
    link: "http://wiki.bibliolabs.cc",
    thumb: "/images/dokuwiki.png",
    vendor_link: "http://www.dokuwiki.org"
  };
  etherpad = {
    title: "Edición colaborativa de texto en tiempo real Etherpad",
    desc: "Etherpad s una herramienta de edición colaborativa en tiempo real de texto, con elemento de chat adicional. Es muy valiosa esta herramienta por permitir la creación de texto por múltiples personas al mismo tiempo de forma colaborativa.",
    manual: "http://wiki.bibliolabs.cc/tdcayc:instructivos:pad",
    link: "http://pad.bibliolabs.cc",
    thumb: "/images/etherpad.png",
    vendor_link: "http://etherpad.org/"
  };
  ethercalc = {
    title: "Edición colaborativa de hoja de cálculo Ethercalc ",
    desc: "Ethercalc es una herramienta para crear tablas de manera colaborativa: permite varios usuarios conectados, ediciones simultaneas o exportar el documento a diferentes formatos. Es muy interesante para el trabajo en grupo.",
    manual: "http://wiki.bibliolabs.cc/tdcayc:instructivos:ethercalc",
    link: "http://calc.bibliolabs.cc",
    thumb: "/images/ethercalc.png",
    vendor_link: "https://ethercalc.org"
  };
  icecast = {
    title: "Streaming Icecast",
    desc: "Icecast es una plataforma que sirve para hacer 'Streaming' (transmisión) de Audio y Video en tiempo real.",
    manual: "http://wiki.bibliolabs.cc/tdcayc:infraestructura:manuales:icecast",
    link: "http://radio.bibliolabs.cc:8000",
    thumb: "/images/icecast.jpg",
    vendor_link: "http://icecast.org/"
  };
  owncloud = {
    title: "Gestión de documentos owncloud",
    desc: "Permite gestionar archivos de todo tipo y sincronizarlos con diferentes dispositivos. Puede entenderse como una nube privada para almacenar datos y puede ser útil para el manejo de archivos compartidos entre las bibliotecas.",
    manual: "http://wiki.bibliolabs.cc/tdcayc:infraestructura:manuales:owncloud",
    link: "https://nube.bibliolabs.cc/",
    thumb: "/images/owncloud.png",
    vendor_link: "https://owncloud.org"
  };
  airtime = {
    title: "Control de emisión de radio Airtime",
    desc: "Airtime es un sistema de control para emisoras virutales, permite dejar listas de reproduccion programadas y hacer programas en vivo. Se puede conectar con nuestro propio icecast o con otro servidor.",
    manual: "http://wiki.bibliolabs.cc/tdcayc:infraestructura:manuales:airtime",
    link: "https://radio.bibliolabs.cc",
    thumb: "/images/airtime.png",
    vendor_link: "https://www.sourcefabric.org/en/airtime/"
  };
  meet = {
    title: "Videoconferencia MEET (JITSI) ",
    desc: "MEET (JITSI) es una plataforma para realizar video conferencias sin requerir un registro. Por ahora esta en modo experimental y solo funciona en google chrome. https://meet.bibliolabs.cc (Guia de Uso)",
    manual: "http://wiki.bibliolabs.cc/tdcayc:infraestructura:manuales:airtime",
    link: "https://meet.bibliolabs.cc",
    thumb: "/images/jitsi.png",
    vendor_link: "https://jitsi.org/Projects/JitsiMeet"
  };
  milfs = {
    title: "Gestor de información MILFS",
    desc: "MILFS es una aplicación para la captura de datos de forma ágil. A priori es un sistema de gestión de formularios personalizados. pero también procesa la información por su semántica, prermitiendo una posterior interpretación.",
    manual: "http://wiki.bibliolabs.cc/tdcayc:infraestructura:manuales:milfs",
    link: "http://www.bibliolabs.cc/milfs",
    thumb: "/images/milfs.png",
    vendor_link: "https://github.com/humano/milfs"
  };

  $scope.root.tools = [wiki,mg,icecast,etherpad,ethercalc,airtime,limesurvey,hotglue,owncloud,sympa,meet,milfs];
  
});
/*************************************
  Inicio Controller
************************************/
app.controller("InicioCtrl", function InicioCtrl($scope, $http ) {
  $scope.root = {};
  $scope.show_viz_items = false;
  $scope.no_show = false;

  $scope.show_items = function() {
    if ($scope.show_viz_items == false) {
      $scope.show_viz_items = true;
    }
  }
});

/*************************************
  Dashboard Controller
************************************/
app.controller("DashboardCtrl", function DashboardCtrl($scope, $http ) {
  $scope.root = {};

  //var wiki_url = "http://wiki.bibliolabs.cc/feed.php?type=atom2&num=5";
  var wiki_url ="/get_wiki_data";
  var mg_url ="/get_mg_data";

  $http.get(wiki_url).success(function(data) {
    var x2js = new X2JS();
    json_data = x2js.xml_str2json(data);
    $scope.root.wiki = json_data.rss.channel;
  }).error(function(data) {
    console.log("Could not get RSS from wiki!");
  });

  $http.get(mg_url).success(function(data) {
    var x2js = new X2JS();
    json_data = x2js.xml_str2json(data);
    $scope.root.mg = json_data.feed;
  }).error(function(data) {
    console.log("Could not get RSS from Mediagoblin!");
  });

  $scope.set_item_content_visible = function(item) {
    if (item['content_visible'] == false) {
      item['content_visible'] = true;
    } else {
      item['content_visible'] = false;
    } 
  }

  $http.get("/get_sympa_data").success(function(data) {
    var x2js = new X2JS();
    json_data = x2js.xml_str2json(data);
    $scope.root.sympa = json_data.rss.channel;
  }).error(function(data) {
    console.log("Could not get RSS from Sympa!");
  });

  $scope.set_item_content_visible = function(item) {
    if (item['content_visible'] == false) {
      item['content_visible'] = true;
    } else {
      item['content_visible'] = false;
    } 
  }

  $scope.get_fecha = function(rawdate) {
    return new Date(rawdate).toLocaleString();
  }

  $http.get("/get_airtime_data").
    success(function(data) {
    if (data.currentShow.length > 0 || data.nextShow.length > 0) {
      $scope.airtime = data;
    } else {
      $scope.no_show = true;
    }
  }).error(function(data) {
    console.log("Error getting show data from airtime");
  })

  $scope.show = function(item) {
//    alert(item.content_visible);
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
id_campo.imagen         = 107;
id_campo.estado         = 24;
//id_campo.titulo     = 19;
id_campo.actividad      = 8;
id_campo.descripcion    = 22;
id_campo.biblioteca     = 20;
id_campo.objetivos      = 89;
id_campo.justificacion  = 48;
id_campo.antiguedad     = 59;
id_campo.origen         = 62;
id_campo.iniciativa     = 58;
id_campo.fecha2015      = 63;
id_campo.duracion       = 45;
id_campo.dias_ejecucion = 64;
id_campo.frecuencia     = 106;
id_campo.horario        = 29;
id_campo.responsable    = 23;
id_campo.rol_responsable= 85;
id_campo.aporte_acceso  = 67;
id_campo.categoria      = 90;
id_campo.aporte_info    = 66;
id_campo.aporte_espacios= 65;
id_campo.cat_espacios   = 91;
id_campo.aporte_fomento = 68;
id_campo.aporte_incidencia= 69;
id_campo.nivel_incidencia= 92;
id_campo.areas          = 43;
id_campo.aporte_canal   = 93;
id_campo.planeacion     = 70;
id_campo.publicos       = 27;
id_campo.publicos_tipo  = 96;
id_campo.otros_publicos = 103;
id_campo.barrios        = 38;
id_campo.comuna         = 40;
id_campo.detalle_barrios= 105;
id_campo.documentacion  = 30;
id_campo.meta_actividades = 83;
id_campo.meta_beneficiarios = 84;
id_campo.meta_productos = 148;
id_campo.conjunta       = 71;
id_campo.con_quien      = 72;
id_campo.categoria_stats= 25;
id_campo.evaluacion     = 86;
id_campo.freq_evaluacion= 104;
id_campo.telefono       = 6;
id_campo.correo         = 15;
id_campo.etiquetas      = 26;

app.controller("PdtCtrl", function PdtCtrl($window,$scope, $http, ItemService, ItemProvider, $modal) {
  $scope.root = {};
  $scope.root.filter_active = [] ;
  $scope.root.filter_items  = {};
  $scope.root.no_results    = false;

  $scope.id_campo = {};

  $scope.show_detail = function(actividad) {
    actividad = $http.get("/activities/" + actividad).
      success(function(data) {
        $scope.root.selected_iniciativa = data;
        $scope.open('lg'); 
      
      }).
      error(function(data) {
        console.log("Could not get activity!");
      });
  }

  $scope.stats = function() {
   $window.location.href = "https://drive.google.com/folderview?id=0B6EAxcjcdDYbflRQSGpHR1MxOWIwYmdqeWJFUnlrZXlNV0g1R3ljQ0RiXy1fZ01YRGxJTms&usp=sharing";
  }

  $scope.novelty = function(actividad) {
  }

  $scope.plan = function(actividad) {
   $window.location.href = "https://drive.google.com/a/bibliotecapiloto.gov.co/folderview?id=0B6EAxcjcdDYbflRWVDJwQVpkdmMzbU9lVGFDUVoydGlEYzNfYWw3eUZkck5FTkZjc2ZjQ0U&usp=sharing";
  }

  $scope.docs = function(actividad) {
  }

  $scope.evaluate = function(actividad) {
   $window.location.href = "https://docs.google.com/spreadsheets/d/13AArhdA6wHZkh1zVNBIw10D3U-NPjUVRGxnchgwNKNo/edit?usp=sharing";
  }


  /******************************
    load initial list of initiatives 
  ******************************/
  /*
  $scope.load_initial = function(iniciativas) {
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

      if ( (! iniciativa.hasOwnProperty($scope.id_campo.actividad)) || (iniciativa[$scope.id_campo.actividad].contenido.length  < 1) ) {
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

  */
  /******************************
   After cards are loaded, check with server on new ones 
  ******************************/
  /*
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
  */
  /******************************
    callback from ItemService
  ******************************/
  /*
  ItemService(function(iniciativas) {
    //console.log(iniciativas);
    $scope.root.todas_iniciativas = iniciativas;
    $scope.load_initial(iniciativas);
    //disabled for Pdt iteration, FB 2015-08-26
    //$scope.check_new_items();
  }, ItemProvider);

  */
  /******************************
    reset all filters 
  ******************************/
  /*
  $scope.reset_filters = function() {
    //console.log("reset filters"); 
    $scope.root.no_results = false;
    $scope.root.filter_active = [];
    $scope.root.filter_items = {};
    $scope.load_initial($scope.root.todas_iniciativas);
  }
  */
  /******************************
    reset specific filter 
  ******************************/
  /*
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
  */
  /******************************
    do_filter
  ******************************/
  /*
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
  */
  /******************************
    filter
  ******************************/
  /*
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
  */
  /******************************
    load more (scroll at end of 
    page) 
  ******************************/
  /*
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

  */
  /******************************
    show detail of an initiative
  ******************************/
  /*
  $scope.show_detail = function(iniciativa) {
    $scope.root.selected_iniciativa = iniciativa;
    $scope.open('lg'); 
  } */

  /******************************
    do filter
  ******************************/
  $scope.open = function (size) {

    var modalInstance = $modal.open({
      //templateUrl: 'partials/iniciativa',
      templateUrl: 'partials/actividad',
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

      if ( (! iniciativa.hasOwnProperty($scope.id_campo.actividad)) || (iniciativa[$scope.id_campo.actividad].contenido.length  < 1) ) {
        delete iniciativas[o];
        continue;
      }

      if ( iniciativa.hasOwnProperty($scope.id_campo.biblioteca)  )  {
        bib = iniciativa[$scope.id_campo.biblioteca].contenido;
        //console.log(iniciativa[$scope.id_campo.biblioteca]);
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

    //console.log(por_bibs);
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
