#####################################################
# Routing
#####################################################
#User    = require('./models/models').User

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

