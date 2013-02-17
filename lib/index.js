var connect = require('connect')

module.exports = function(sequelize, options) {
  var Sequelize = sequelize.constructor

  var getCredentials = function(via, req) {
     var credentials = {}

    switch ((via || 'query').toLowerCase()) {
      case 'query':
        credentials.user     = req.query.user
        credentials.password = req.query.password
        break
      case 'body':
        credentials.user     = req.body.user
        credentials.password = req.body.password
        break
      case 'params':
        credentials = getCredentials('body', req)

        if (!credentials.user) {
          credentials = getCredentials('query', req)
        }

        break
      case 'headers':
        credentials.user     = req.headers.user
        credentials.password = req.headers.password
        break
    }

    return credentials
  }

  var isInScope = function(path) {
    return (path || "").indexOf(options.scope || '') === 0
  }

  return function(req, res, next) {
    if (isInScope(req.path)) {
      connect.bodyParser()(req, res, function() {
        var credentials = getCredentials(options.via, req)
          , _sequelize  = new Sequelize(sequelize.config.database, credentials.user, credentials.password, sequelize.options)

        _sequelize.query('select 1 + 1', null, { raw: true }).complete(function(err) {
          if (!!err) {
            res.statusCode = 401;
            res.end('Unauthorized');
          } else {
            next()
          }
        })
      })
    } else {
      next()
    }
  }
}
