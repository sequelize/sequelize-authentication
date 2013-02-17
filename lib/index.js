var connect = require('connect')

module.exports = function(sequelize, options) {
  var Sequelize = sequelize.constructor

  var extractCredentialsFromSource = function(source) {
    try {
      if ((options || {}).param) {
        return {
          user:     source[(options || {}).param].user,
          password: source[(options || {}).param].password
        }
      } else {
        return {
          user:     source.user,
          password: source.password
        }
      }
    } catch(e) {
      return {}
    }
  }

  var getCredentials = function(via, req) {
     var credentials = {}

    switch ((via || 'params').toLowerCase()) {
      case 'query':
        credentials = extractCredentialsFromSource(req.query)
        break
      case 'body':
        credentials = extractCredentialsFromSource(req.body)
        break
      case 'params':
        credentials = getCredentials('body', req)

        if (!credentials.user) {
          credentials = getCredentials('query', req)
        }

        break
      case 'headers':
        credentials = extractCredentialsFromSource(req.headers)
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
