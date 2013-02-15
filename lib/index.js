var connect   = require('connect')

module.exports = function(sequelize, options) {
  var Sequelize = sequelize.constructor

  return function(req, res, next) {
    connect.bodyParser()(req, res, function() {
      var _sequelize = new Sequelize(sequelize.config.database, req.query.user, req.query.password, sequelize.options)

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
