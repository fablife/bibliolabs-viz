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
        templateUrl: 'plan_de_trabajo_drive',
        controller: 'PdtCtrl'
      }).      when('/vitrina', {
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
  

id_campo = {};

id_campo.marca_temporal   = "marcatemporal" 
id_campo.nombre_usuario   = "nombredeusuario"
id_campo.biblioteca       = "biblioteca"
id_campo.tipo_actividad   = "tipodeactividad"
id_campo.actividad        = "actividad"
id_campo.descripcion      = "descripción"
id_campo.objetivos        = "objetivos"
id_campo.justificacion    = "justificación"
id_campo.pertenece        = "iniciativaalaquepertenece"
id_campo.planeacion       = "planeacióndelaactividad"
id_campo.areas_canales    = "áreasocanales"
id_campo.como_aporta      = "comoaportacadacanaloáreaseleccionada"
id_campo.documentacion    = "documentación"
id_campo.historia         = "historiadelaactividad"
id_campo.aporte_info      = "aporteaaccesoainformaciónpertinenteconelterritorio"
id_campo.aporte_espacio   = "aporteaespaciosdeencuentroacogedoreseincluyentes"
id_campo.aporte_fomento   = "aporteafomentoalainnovacióncolaborativa"
id_campo.aporte_incide    = "aporteaincidenciaeintercambioenelconocimiento"
id_campo.aporte_nivel     = "enqueniveldeincidenciaeintercambioenelconocimiento"
id_campo.aporte_acceso    = "aporteaaccesoaformaciónparaeldesarrollohumanointegral"
id_campo.cat_form         = "enquecategoríadeformación"
id_campo.conjunta         = "ejecuciónconjunta"
id_campo.con_quiern       = "siesconotrosconquienesseejecuta"
id_campo.metaactividades  = "metaactividades"
id_campo.metabeneficio    = "metabeneficiarios"
id_campo.genera           = "estaactividadgenerarácontenidosoproductos"
id_campo.desc_productos   = "descripcióndelosproductos"
id_campo.metaproductos    = "metaproductos"
id_campo.publicos_edad    = "públicosobjetivoporgrupoetario"
id_campo.publicos_social  = "públicosobjetivoporgruposocial"
id_campo.publicos_etnia   = "públicosobjetivoporgrupoetnico"
id_campo.publicos_otros   = "otrospublicos"
id_campo.barrios          = "barriosdeinfluencia"
id_campo.detalle_barrios  = "detallebarriosdeinfluencia"
id_campo.dia_inicio       = "díadeinicio2016"
id_campo.mes_inicio       = "mesdeinicio2016"
id_campo.dias_ejecucion   = "díasdeejecución"
id_campo.frecuencia       = "frecuenciadelaactividad"
id_campo.horario          = "horario"
id_campo.duracion         = "mesessemanasyodíasquedurarásuejecución"
id_campo.antiguedad       = "antigüedaddelaactividad"
id_campo.dedonde          = "dedóndeprovienelaideadelaactividad"
id_campo.cat_stats        = "categoríaestadística"
id_campo.evalua           = "comoseevaluarálaactividad"
id_campo.frecuencia_eval  = "frecuenciadeevaluación"
id_campo.responsables     = "nombresdelresponsables"
id_campo.rolesresponsables= "rolesdelresponsables"
id_campo.telefono         = "teléfonodecontacto"
id_campo.correo           = "correoelectrónicodecontacto"
id_campo.institucion      = "institucionoproyectoalquepertenecelaactividad"
id_campo.condiciones      = "condicionesdetiempoyocobertura"
id_campo.apoyo            = "apoyoyacompañamientosdesdelabiblioteca"
/*************************************
  Plan de Trabajo Controller
************************************/
app.controller("PdtCtrl", function PdtCtrl($window,$scope, $http, $modal) {
  $scope.root = {};
  $scope.root.filter_items  = {};
  $scope.root.filter_active = [] ;
  $scope.root.no_results    = false;
  $scope.root.loading       = true;
  $scope.root.bibliotecas     = [];
  $scope.root.publicos_edad   = [];
  $scope.root.publicos_social = [];
  $scope.root.publicos_etnia  = [];
  $scope.root.publicos_otros  = [];
  $scope.root.cat_stats       = [];
  $scope.root.cat_form        = [];

  $scope.root.testdata  = [];


  $scope.root.id_campo = id_campo;
  /******************************
    get data from server 
  ******************************/
  
  $http.get('/get_pdt_data')
    .success(function(data,stat,headers,conf) {
      //console.log(data);
      $scope.root.todas_iniciativas = data;
      $scope.load_initial(data);
      $scope.root.loading = false;
  
    })
    .error(function(data,stat,headers,conf) {
      console.log("Error getting pdt data!");
      console.log(data);
      $scope.root.loading = false;
    });


  /******************************
    scope functions 
  ******************************/
  

  /******************************
    load initial list of initiatives 
  ******************************/
  $scope.load_initial = function(data) {
    $scope.root.bibliotecas     = data.bibliotecas;
		//console.log(data.bibliotecas);
    $scope.root.actividades     = data.actividades;
    if ($scope.root.actividades.length == 0) {
      $scope.root.no_results = true;
    }
    $scope.root.publicos_edad   = ["Primera infancia", "Niños", "Adolescentes", "Jóvenes", "Adultos", "Adultos mayores", "Todos"];
    //$scope.root.publicos_edad   = data.publicos_edad;
    $scope.root.publicos_social = build_filter_options_from_data(data.publicos_social);
    //$scope.root.publicos_etnia  = data.publicos_etnia;
    //$scope.root.publicos_otros  = data.publicos_otros;
    $scope.root.cat_stats       = build_filter_options_from_data(data.categorias_stats);
    //$scope.root.cat_form        = data.categorias_form;
    //$scope.root.areas_canales 	= data.areas_canales;
    $scope.root.areas_canales 	= build_filter_options_from_data(data.areas_canales); 

    //$scope.root.visible_ids = [];
  }

	var build_filter_options_from_data = function(data) {
		var options = {};
		var asArray	= [];

		for (var i=0; i<data.length; i++) {
			var val		= data[i];
			var elems	= val.split(",")
		 	for (var k=0; k<elems.length; k++) {	
				var elem = elems[k].trim();
				if (elem && (! options[elem])) {
					options[elem] = elem;
				}
			}
		}

		for (var p in options) {
			if (options.hasOwnProperty(p)) {
				asArray.push(options[p]);
			}
		}

		return asArray.sort();
  }		
 
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
      $scope.root.actividades = $scope.root.todas_iniciativas.actividades; 
      for (var i=0; i<$scope.root.filter_active.length; i++) {
        var item = $scope.root.filter_active[i];
        $scope.do_filter(item, $scope.root.filter_items[item],$scope.root.actividades);
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
        if (items[o][filter] == filter_item) {
          filtered.push(items[o]);
          continue;
        }
        if ( items[o][filter].indexOf(filter_item) > -1 )  {
          filtered.push(items[o]);
          continue;
        }
      }
    }

    $scope.root.actividades = filtered;

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

    var items = $scope.root.actividades;

    if ($scope.root.filter_active.length == 1) {
      items = $scope.root.todas_iniciativas.actividades;
    }

    $scope.do_filter(filter, item, items);
  }
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
  $scope.show_detail = function(iniciativa) {
    $scope.root.selected_iniciativa = iniciativa;
    $scope.open('lg'); 
  } 

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


app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.actividad = items;
  $scope.id_campo  = id_campo;

  $scope.selected = {
    item: $scope.items
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
