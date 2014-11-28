#####################################################
# Routing
#####################################################
Latest = require('./models/Latest').Latest
http = require('http')

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


wiki_options = {
  host: 'wiki.bibliolabs.cc',
  path: '/feed.php?type=atom2&num=5'
}

mg_options = {
  host: 'media.bibliolabs.cc',
  path: '/atom/'
}

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


