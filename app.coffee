################################################################
#Requires
################################################################
require('coffee-script')
require('coffee-trace')
flash     = require('connect-flash')
express   = require('express')
session   = require('express-session')
errorhandler = require('errorhandler')
#passport  = require('passport')
mongoose  = require('mongoose')
config    = require('./config')
routes    = require('./routes')

#admin     = require('./admin')

#User      = require('./models/models').User

handle_error = require('./utils').handle_error

################################################################
#Connect to DB
################################################################
db = mongoose.connect(config.creds.mongoose_auth_local)

################################################################
#Middleware to check that a user is authenticated
################################################################
#ensureAuthenticated = (req, res, next) ->
#      if (req.isAuthenticated())
#          return next()
#      console.log "Not authenticated!"
#      res.redirect('/')

################################################################
#Middleware to check that a user has admin role 
################################################################
#ensureAdmin = (req, res, next) ->
#      if (req.user.admin)
#          return next()
#      console.log "Not admin!"
#      res.redirect('/')

app = module.exports = express()

################################################################
# Set up passport Basic API auth
# NOTE: I am perfectly aware that this solution is not secure!
# For a secure solution, at least HTTPS should be used.
# Better still, using OAuth2.0 would improve security 
################################################################
#BasicStrategy = require('passport-http').BasicStrategy;

#passport.use(new BasicStrategy(
#  (email, password, done) -> 
#    console.log("API access")
#    User.findOne({ email: email }, (err, user) -> 
#      if err? 
#        return done(err)
#      if not user 
#        console.log("API Access denied: user invalid")
#        return done(null, false)
#      if password isnt user.password #Of course this is not standard, the password should be encrypted ;)
#        console.log("API Access denied: invalid password")
#        return done(null, false); 
#      return done(null, user);
#    );
#));
################################################################
#Set up passport
################################################################
#LocalStrategy = require('passport-local').Strategy
#passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) ->
#    User.findOne({ email: email}, (err, user) ->
#      console.log("findone")
#      if err?
#         console.log "error in findone"
#         return done(err)
#      if not user
#        console.log("Access denied: user invalid")
#        return done(null, false, { message: 'Access denied: User invalid' })
#      if password isnt user.password #Of course this is not standard, the password should be encrypted ;)
#          return done(null, false, {message: "Access denied: Incorrect password" })
#      done(null,user)
#    )
#))

################################################################
#configure the app
################################################################
env = process.env.NODE_ENV || 'development'
if ('development' == env) 
  app.use(errorhandler())

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

app.use session(
  secret: 'bibliolabs viz session',
  saveUninitialized: true,
  resave: true
)
app.use(express.static(__dirname + '/public'))
app.use('/bower_components',  express.static(__dirname + '/bower_components'))
app.use(flash())
#  app.use(passport.initialize())
#  app.use(passport.session())

################################################################
# Passport session setup.
# To support persistent login sessions, Passport needs to be able to
# serialize users into and deserialize users out of the session. Typically,
# this will be as simple as storing the user ID when serializing, and finding
# the user by ID when deserializing.
################################################################
#passport.serializeUser((user, done) ->
#      #console.log "SerializeUser"
#      done(null, user._id)
#)

#passport.deserializeUser((id, done) ->
      #done(null,id)
      #console.log "DeserializeUser"
#      User.findById(id, (err, user) ->
#         done(err, user)
#      )
#)

################################################################
#  Routes
################################################################
#urls      = require('./urls')
app.get('/', routes.index)
app.get('/dashboard', routes.dashboard)

###
app.post '/login', (req, res, next) ->
  passport.authenticate('local', (err, user, info) ->
    console.log "authenticate callback"
    if err?
      console.log "err in authenticate callback"
      return next(err)
    if not user
      console.log "User NOT in auth callback"
      req.flash("loginerror", info.message)
      return res.redirect('/login')
    if not user.active
      console.log "User not active yet"
      req.flash("loginerror", "You have not yet activated your registration! Please check your email")
      return res.redirect('/login')
    req.logIn user, (err) ->
      if err?
        console.log "err! " + err
        res.redirect("/", { message: req.flash(err)})
        return
      console.log("Is user admin: " + user.admin) 
      if user.admin
        console.log "redirecting to admin"
        res.redirect("/admin")
      else
        console.log "redirecting to dashboard"
        res.redirect("/dashboard")
  )(req, res, next)
###

#All routes below need authentication
#app.all('*',ensureAuthenticated)

#app.get('/logout', routes.logout)

#routes for expenses
#app.get('/expenses', routes.expenses)

#admin routes
###
app.get('/admin', ensureAdmin, admin.index)
app.get('/admin/users', ensureAdmin, admin.users)
app.post('/admin/users', ensureAdmin, admin.save_user)
app.delete('/admin/users/:userId', ensureAdmin, admin.delete_user)
###

###
app.get('/admin/partials/:name',(req, res) ->
   name = req.params.name
   res.render('admin/partials/' + name)
)
###

app.get('/partials/:name',(req, res) ->
   name = req.params.name
   #res.render('partials/' + name, {is_admin: "admin" == req.user.role})
   res.render('partials/' + name)
)



################################################################
#Start the app
################################################################
app.listen(config.app.port, () ->
      console.log("Express server listening on port %d in %s mode", config.app.port, app.settings.env)
)
