var connect   = require('connect')

module.exports = function(sequelize, options) {
  var Sequelize = sequelize.constructor

  return function(req, res, next) {
    connect.bodyParser()(req, res, function() {
      var user     = null
        , password = null

      switch (options.via.toUpperCase()) {
        case 'QUERY':
          user     = req.query.user
          password = req.query.password
          break
        case 'BODY':
          user     = req.body.user
          password = req.body.password
          break
        case 'HEADERS':
          user     = req.headers.user
          password = req.headers.password
          break
      }

      var _sequelize = new Sequelize(sequelize.config.database, user, password, sequelize.options)

      _sequelize.query('select 1 + 1', null, { raw: true }).complete(function(err) {
        if (!!err) {
          res.statusCode = 401;
          res.end('Unauthorized');
        } else {
          next()
        }
      })
    })
  }
}
