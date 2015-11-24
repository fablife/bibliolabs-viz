####################/################################
# Routing
#####################################################
Latest = require('./models/Latest').Latest
http = require('http')
logger = require('tracer').colorConsole()

SOURCE = "drive" #could be "milfs"

handle_error = require("./utils").handle_error
multiparty = require('multiparty')

exports.index = (req,res) ->
  res.render('index', {message: req.flash('loginerror')})

###
exports.logout = (req, res) ->
  req.logout()
  res.redirect('/')

exports.dashboard = (req,res) ->
  res.render('dashboard')
###

###
api_options = {
  host: 'www.bibliolabs.cc',
  path: '/milfs/api.php/json?id=2'
}
###
api_options = {
  host: 'localhost',
  path: '/milfs/api.php?id=2'
}
wiki_options = {
  host: 'wiki.bibliolabs.cc',
  path: '/feed.php?type=atom2&num=5'
}

mg_options = {
  host: 'media.bibliolabs.cc',
  path: '/atom/'
}

airtime_options = {
  host: 'radio.bibliolabs.cc',
  path: '/api/live-info?type=endofday'
}

sympa_options = {
  host: 'listas.bibliolabs.cc',
  path: '/wws/rss/latest_arc/bibliolabs?for=3&count=6'
}

bibliotecas = []
publicos    = []
categorias  = []
visible_ids = []

por_bibs    = []
por_bibs_o  = {}

actividades       = []
publicos_edad     = []
publicos_social   = []
publicos_etnia    = []
publicos_otros    = []
categorias_stats  = []
categorias_form   = []

id_campo = {}

id_campo.titulo             = 19
id_campo.imagen             = 107
id_campo.estado             = 24
id_campo.actividad          = 8
id_campo.descripcion        = 22
id_campo.biblioteca         = 20
id_campo.objetivos          = 89
id_campo.justificacion      = 48
id_campo.antiguedad         = 59
id_campo.origen             = 62
id_campo.iniciativa         = 58
id_campo.fecha2015          = 63
id_campo.duracion           = 45
id_campo.dias_ejecucion     = 64
id_campo.frecuencia         = 106
id_campo.horario            = 29
id_campo.responsable        = 23
id_campo.rol_responsable    = 85
id_campo.aporte_acceso      = 67
id_campo.categoria          = 90
id_campo.aporte_info        = 66
id_campo.aporte_espacios    = 65
id_campo.cat_espacios       = 91
id_campo.aporte_fomento     = 68
id_campo.aporte_incidencia  = 69
id_campo.nivel_incidencia   = 92
id_campo.areas              = 43
id_campo.aporte_canal       = 93
id_campo.planeacion         = 70
id_campo.publicos           = 27
id_campo.publicos_tipo      = 96
id_campo.otros_publicos     = 103
id_campo.barrios            = 38
id_campo.comuna             = 40
id_campo.detalle_barrios    = 105
id_campo.documentacion      = 30
id_campo.meta_actividades   = 83
id_campo.meta_beneficiarios = 84
id_campo.meta_productos     = 148
id_campo.conjunta           = 71
id_campo.con_quien          = 72
id_campo.categoria_stats    = 25
id_campo.evaluacion         = 86
id_campo.freq_evaluacion    = 104
id_campo.telefono           = 6
id_campo.correo             = 15
id_campo.etiquetas          = 26

sort_by_id = (data) ->
  console.log("sort_by_id, data length: " + data.length)
  json = JSON.parse(data)
  obj_by_id = {}
  i = 0
  while i < json.length
    obj = json[i]
    if !(obj.identificador of obj_by_id)
      obj_by_id[obj.identificador] = {}
    obj_by_id[obj.identificador][obj.id_campo] = obj
    i++
  obj_by_id


exports.get_activity = (req, res) ->
  console.log "get_activity"
  id = req.params.id
  if not id or id < 1
    console.log("get_activity: invalid id! Aborting.")
    return null
  else
    for actividad in por_bibs
      if actividad.hasOwnProperty(id_campo.actividad) and actividad[id_campo.actividad].identificador == id
        console.log("Requested activity found!")
        res.status(200).send(actividad)
        return
        
    console.log("Requested activity could not be found")
    res.status(404).send()
    
load_initial = (actividades) ->
  for o of actividades

      actividad = actividades[o]

      if actividad.hasOwnProperty(id_campo.estado) and actividad[id_campo.estado].contenido == 'Inactivo'
        console.log("Deleting coz estado")
        delete actividades[o]
        continue

      if !actividad.hasOwnProperty(id_campo.actividad) or actividad[id_campo.actividad].contenido.length < 1
        #if !actividad.hasOwnProperty(id_campo.titulo) or actividad[id_campo.titulo].contenido.length < 1
          console.log("Deleting coz actividad")
          #console.log(JSON.stringify(actividad))
          delete actividades[o]
          continue
        #else
        #  actividad[id_campo.actividad] = actividad[id_campo.titulo]

      if actividad.hasOwnProperty(id_campo.biblioteca)
        bib = actividad[id_campo.biblioteca].contenido

        if bibliotecas.indexOf(actividad[id_campo.biblioteca].contenido) == -1
          bibliotecas.push bib

        if !(bib of por_bibs_o)
          por_bibs_o[bib] = actividad
        else
          ini = por_bibs_o[bib]
          if ini[id_campo.biblioteca].contenido == bib
            if ini[id_campo.biblioteca]['timestamp'] < actividad[id_campo.biblioteca]['timestamp']
              por_bibs_o[bib] = actividad

      if actividad.hasOwnProperty(id_campo.publicos) and publicos.indexOf(actividad[id_campo.publicos].contenido) == -1
        pub = actividad[id_campo.publicos].contenido
        publicos.push pub

      if actividad.hasOwnProperty(id_campo.categoria) and publicos.indexOf(actividad[id_campo.categoria].contenido) == -1
        categorias.push actividad[id_campo.categoria].contenido

  ###
    if actividad.hasOwnProperty(id_campo.destacado) and actividad[id_campo.destacado].contenido == 'Si'
      $scope.root.destacados.push actividad
  ###
  for b of por_bibs_o
    `b = b`
    o = por_bibs_o[b]
    por_bibs.push o
    visible_ids.push o[id_campo.biblioteca].identificador

  #console.log("load_initial, por_bibs: " + por_bibs)
  return por_bibs

exports.pdt = (req, res) ->

  if SOURCE == "milfs"
    console.log("Get API data from milfs...")

    callback = (response) ->
      str = ''

      #another chunk of data has been recieved, so append it to `str`
      response.on('data', (chunk) ->
        str += chunk
      )

      #the whole response has been recieved, so we just print it out here
      response.on('end', () ->
        console.log("Getting API data succeeded. Processing...")
        actividades = load_initial(sort_by_id(str))
        console.log("Done processing. Found " + actividades.length + " acitivities. Rendering page.")
        #console.log(actividades)
        res.render('plan_de_trabajo', { publicos: publicos, categorias: categorias,actividades: actividades, id_campo: id_campo })
     )
    if por_bibs.length < 1
      console.log("No values in cache, going to get data from server.")
      http.request(api_options, callback).end()
    else
      console.log("Getting objects from cache!")
      res.render('plan_de_trabajo', { publicos: publicos, categorias: categorias,actividades: por_bibs, id_campo: id_campo })
  else
    console.log("Get API data from Google drive...we do this client side....")
    res.render('plan_de_trabajo_drive')


exports.get_pdt_data =  (req, res) ->
    
    #publicos     = {}
    #categorias   = {}
    #actividades = {}
    id_campo    = _build_column_names()
    raw_data    = null

    GoogleSpreadsheet = require("google-spreadsheet")
    pdt = new GoogleSpreadsheet('1sdaYTl1ziZTUcYTXXkz2nfrFHm7eRsJ_Be0rh4UIk50')
    #pdt = new GoogleSpreadsheet('1dGclG3eKxE-Rp0cBkVwZ4gE34yh6g20ep0aj4p4XKk0')
    creds = require('./plan_de_trabajo_claves_google.json')
     

    logger.trace("Creds loaded. Connecting to Google Drive...")
    pdt.useServiceAccountAuth creds, (err) ->
        logger.trace("Returned from auth")
        # getInfo returns info about the sheet and an array or "worksheet" objects 
        if err
          logger.error("Error in auth")
          return error("Error useServiceAccountAuth")

        logger.trace("auth ok. get sheet info...")
        pdt.getInfo( ( err, sheet_info ) ->
            logger.trace("returned from getInfo")
            if err
               error("Error pdt.getInfo", err)
               res.send("Error getting data from Google Drive")
               return
        
            #console.log(sheet_info)
            logger.info("data loaded")
            #use worksheet object if you want to stop using the # in your calls 
     
            sheet1 = sheet_info.worksheets[0]
            sheet1.getRows( ( err, rows ) ->
                if err
                  error("ERROR downloading rows from Google Drive Spreadsheet", err, res)
                  return res.send("Error downloading rows from Google Drive Spreadsheet")
              
                logger.info "Data for iniciativas successfully downloaded from Google drive"
                raw_data = rows
                logger.trace(raw_data)
                _get_objects_from_drive_data(id_campo, raw_data)
                res.send({
                        id_campo: id_campo,
                        bibliotecas: bibliotecas,
                        publicos_edad: publicos_edad, 
                        publicos_social: publicos_social, 
                        publicos_etnia: publicos_etnia, 
                        publicos_otros: publicos_otros, 
                        categorias_stats: categorias_stats,
                        categorias_form: categorias_form,
                        actividades: actividades})
                logger.debug("Successfully sent data to client")
            )
        )


_build_column_names = () ->
    cols = {} 
    cols.marca_temporal   = "marcatemporal" 
    cols.nombre_usuario   = "nombredeusuario"
    cols.biblioteca       = "biblioteca"
    cols.tipo_actividad   = "tipodeactividad"
    cols.actividad        = "actividad"
    cols.descripcion      = "descripción"
    cols.objetivos        = "objetivos"
    cols.justificacion    = "justificacion"
    cols.pertenece        = "iniciativaalaquepertenece"
    cols.planeacion       = "planeacióndelaactividad"
    cols.areas_canales    = "áreasocanales"
    cols.como_aporta      = "comoaportacadacanaloáreaseleccionada"
    cols.documentacion    = "documentación"
    cols.historia         = "historiadelaactividad"
    cols.aporte_info      = "aporteaaccesoainformaciónpertinenteconelterritorio"
    cols.aporte_espacio   = "aporteaespaciosdeencuentroacogedoreseincluyentes"
    cols.aporte_fomento   = "aporteafomentoalainnovacióncolaborativa"
    cols.aporte_incide    = "aporteaincidenciaeintercambioenelconocimiento"
    cols.aporte_nivel     = "enqueniveldeincidenciaeintercambioenelconocimiento"
    cols.aporte_acceso    = "aporteaaccesoaformaciónparaeldesarrollohumanointegral"
    cols.cat_form         = "enquecategoríadeformación"
    cols.conjunta         = "ejecuciónconjunta"
    cols.con_quien        = "siesconotrosconquienesseejecuta"
    cols.metaactividades  = "metaactividades"
    cols.metabeneficio    = "metabeneficiarios"
    cols.genera           = "estaactividadgenerarácontenidosoproductos"
    cols.desc_productos   = "descripcióndelosproductos"
    cols.metaproductos    = "metaproductos"
    cols.publicos_edad    = "públicosobjetivoporgrupoetario"
    cols.publicos_social  = "públicosobjetivoporgruposocial"
    cols.publicos_etnia   = "públicosobjetivoporgrupoetnico"
    cols.publicos_otros   = "otrospublicos"
    cols.barrios          = "barriosdeinfluencia"
    cols.detalle_barrios  = "detallebarriosdeinfluencia"
    cols.dia_inicio       = "díadeinicio2016"
    cols.mes_inicio       = "mesdeinicio2016"
    cols.dias_ejecucion   = "díasdeejecución"
    cols.frecuencia       = "frecuenciadelaactividad"
    cols.horario          = "horario"
    cols.duracion         = "mesessemanasyodíasquedurarásuejecución"
    cols.antiguedad       = "antigüedaddelaactividad"
    cols.dedonde          = "dedóndeprovienelaideadelaactividad"
    cols.cat_stats        = "categoríaestadísticas"
    cols.evalua           = "comoseevaluarálaactividad"
    cols.frec_eval        = "frecuenciadeevaluación"
    cols.responsables     = "nombresdelresponsables"
    cols.rolesresponsables= "rolesdelresponsables"
    cols.telefono         = "teléfonodecontacto"
    cols.correo           = "correoelectrónicodecontacto"
    cols.institucion      = "institucionoproyectoalquepertenecelaactividad"
    cols.condiciones      = "condicionesdetiempoyocobertura"
    cols.apoyo            = "apoyoyacompañamientosdesdelabiblioteca"

    cols
    

_get_objects_from_drive_data = (cols, raw_data) ->

  actividades       = []
  bibliotecas       = []
  publicos_edad     = []
  publicos_social   = []
  publicos_etnia    = []
  publicos_otros    = []
  categorias_stats  = []
  categorias_form   = []

  for row in raw_data
      actividades.push(row)
      _check_entry(bibliotecas, row[cols.biblioteca])
      _check_entry(publicos_edad, row[cols.publicos_edad])
      _check_entry(publicos_social, row[cols.publicos_social])
      _check_entry(publicos_etnia, row[cols.publicos_etnia])
      _check_entry(publicos_otros, row[cols.publicos_otros])
      _check_entry(categorias_stats, row[cols.cat_stats])
      _check_entry(categorias_form, row[cols.cat_form])



_check_entry = (arr, field) ->
  if not arr[field]
    arr.push(field)

error = (msg, err, res) ->
  logger.error(msg)
  logger.error(err)
  if res
    res.statusCode = 500
    res.end()

exports.get_sympa_data = (req, res) ->
  console.log("Get RSS from Sympa...")

  callback = (response) ->
    str = ''

    #another chunk of data has been recieved, so append it to `str`
    response.on('data', (chunk) ->
      str += chunk
    )

    #the whole response has been recieved, so we just print it out here
    response.on('end', () ->
      console.log("RSS feed succeeded.")
      res.status(200).send(str)
   )
  http.request(sympa_options, callback).end()

exports.get_airtime_data = (req, res) ->
  console.log("Get latest from Airtime...")

  callback = (response) ->
    str = ''

    #another chunk of data has been recieved, so append it to `str`
    response.on('data', (chunk) ->
      str += chunk
    )

    #the whole response has been recieved, so we just print it out here
    response.on('end', () ->
      console.log("RSS feed succeeded.")
      res.status(200).send(str)
   )
  http.request(airtime_options, callback).end()


exports.get_wiki_data = (req, res) ->
  console.log("Get RSS from wiki...")

  callback = (response) ->
    str = ''

    #another chunk of data has been recieved, so append it to `str`
    response.on('data', (chunk) ->
      str += chunk
    )

    #the whole response has been recieved, so we just print it out here
    response.on('end', () ->
      console.log("RSS feed succeeded.")
      res.status(200).send(str)
   )
  http.request(wiki_options, callback).end()

exports.get_mg_data = (req, res) ->
  console.log("Get RSS from mediagoblin...")

  callback = (response) ->
    str = ''

    #another chunk of data has been recieved, so append it to `str`
    response.on('data', (chunk) ->
      str += chunk
    )

    #the whole response has been recieved, so we just print it out here
    response.on('end', () ->
      console.log("RSS feed succeeded.")
      res.status(200).send(str)
   )
  http.request(mg_options, callback).end()

exports.check_latest = (req,res) ->
  if (req.method != "POST") && (! req.xhr)
    res.status(403).end()
  id = req.body.id
  timestamp = req.body.timestamp

  Latest.findOne({'id':id},(err, latest) ->
    if err?
      msg = "Intento de encontrar Latest con id: " + id + ", pero hubo error: "
      handle_error(err, msg, res)
    else
      if latest
        if parseInt(latest.timestamp) < parseInt(timestamp)
          latest.timestamp = timestamp
          latest.save((err)
            console.log("Latest actualizado! ID: "+ id)
          )
          res.status(200).send(id)
        else
          #console.log("Este Latest existe pero no necesita actualización")
          res.status(304).end()

      else
        l = new Latest()
        l.id = id
        l.timestamp = timestamp
        l.save((err) ->
          if err?
            handle_error(err, "Error salvando info para Latest", res)
            res.status(400).end()
          else
            console.log("Grabé un nuevo Latest! ID: " + id )
            res.status(403).end()
        )
    )


