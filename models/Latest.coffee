###################################
### MODELS FOR THE APPLICATION
###################################
mongoose  = require('mongoose')


Schema    = mongoose.Schema

LatestSchema = new Schema({
  id:       { type: String},
  timestamp:{ type: String},
})

exports.Latest = mongoose.model('Latest', LatestSchema)
