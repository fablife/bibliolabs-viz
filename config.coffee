#####################################################
# Configuration entries 
#####################################################
exports.creds = {
  #Your mongo auth uri goes here
  # e.g. mongodb://username:server@mongoserver:10059/somecollection
  # nationalpark is the name of my mongo database
  mongoose_auth_local: 'mongodb://localhost/bibliolabs-viz',
  #mongoose_auth_jitsu: 'copy and paste your unique connection string uri from the nodejitsu admin'
}

exports.app = {
    port: 3344,
}
