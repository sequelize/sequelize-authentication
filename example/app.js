var express      = require('express')
  , http         = require('http')
  , authenticate = require(__dirname + '/../lib/index')
  , Sequelize    = require('sequelize')
  , sequelize    = new Sequelize('sequelize_authentication', 'root', null, { logging: false })
  , app          = express()


app.configure(function(){
  app.set('port', process.env.PORT || 3000)

  app.use(express.favicon())
  app.use(express.bodyParser())
  app.use(express.methodOverride())

  // app.use(authenticate(sequelize, { via: 'query' }))
  // app.use(authenticate(sequelize, { via: 'body' }))
  // app.use(authenticate(sequelize, { via: 'params' }))
  // app.use(authenticate(sequelize, { via: 'headers' }))
  // app.use(authenticate(sequelize, { via: 'params', scope: '/api' }))
  app.use(authenticate(sequelize, { via: 'params', param: 'credentials' }))
  app.use(app.router)
})

app.get('/', function(req, res, next) {
  res.send('hello world')
})

app.post('/', function(req, res, next) {
  res.send('hello world')
})

app.get('/api/secret', function(req, res, next) {
  res.send('hello world')
})

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'))
})
