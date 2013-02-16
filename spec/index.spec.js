var buster         = require('buster')
  , Authentication = require(__dirname + '/../lib/index')
  , uuid           = require('node-uuid')
  , Sequelize      = require('sequelize-postgres').sequelize
  , sequelize      = new Sequelize('sequelize_test', 'root', null, { logging: false })

buster.spec.expose()

describe('sequelize-authentication', function() {
  var tests = [{
    title:         'authentication data in query',
    via:           'query',
    dataAttribute: 'query'
  }, {
    title:         'authentication data in post body',
    via:           'body',
    dataAttribute: 'body'
  }, {
    title:         'authentication data in headers',
    via:           'headers',
    dataAttribute: 'headers'
  }, {
    title:         'authentication data in the query with params mode',
    via:           'params',
    dataAttribute: 'query'
  }, {
    title:         'authentication data in the post body with params mode',
    via:           'params',
    dataAttribute: 'body'
  }]

  tests.forEach(function(test) {
    describe(test.title, function() {
      before(function() {
        this.authenticate = Authentication(sequelize, { via: test.via })
      })

      it('raises an error if authentication fails', function(done) {
        var options = { headers: {}, query: {}, body: {} }
        options[test.dataAttribute] = { user: uuid.v1(), password: uuid.v1() }

        this.authenticate(options, {
          end: function(msg) {
            expect(msg).toEqual('Unauthorized')
            done()
          }
        }, function(){})
      })

      it('calls the passed function if credentials are correct', function(done) {
        var options = { headers: {} }
        options[test.dataAttribute] = { user: 'root', password: '' }

        this.authenticate(options, {}, function(){
          expect(1).toEqual(1)
          done()
        })
      })
    })
  }.bind(this))
})
