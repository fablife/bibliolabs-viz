#####################################################
# Routing
#####################################################
Latest = require('./models/Latest').Latest

handle_error = require("./utils").handle_error
multiparty = require('multiparty')

exports.index = (req,res) ->
  res.render('index', {message: req.flash('loginerror')})

###
exports.logout = (req, res) ->
  req.logout()
  res.redirect('/')
###

exports.dashboard = (req,res) ->
  res.render('dashboard')

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


