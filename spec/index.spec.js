var buster         = require('buster')
  , Authentication = require(__dirname + '/../lib/index')
  , uuid           = require('node-uuid')
  , Sequelize      = require('sequelize')
  , sequelize      = new Sequelize('sequelize_authentication', 'root', null, { logging: false })

buster.spec.expose()

describe('sequelize-authentication', function() {
  describe('via option', function() {
    var tests = [{
      title:         'authentication data in query',
      options:       { via: 'query' },
      dataAttribute: 'query'
    }, {
      title:         'authentication data in post body',
      options:       { via: 'body' },
      dataAttribute: 'body'
    }, {
      title:         'authentication data in headers',
      options:       { via: 'headers' },
      dataAttribute: 'headers'
    }, {
      title:         'authentication data in the query with params mode',
      options:       { via: 'params' },
      dataAttribute: 'query'
    }, {
      title:         'authentication data in the post body with params mode',
      options:       { via: 'params' },
      dataAttribute: 'body'
    }]

    tests.forEach(function(test) {
      describe(test.title, function() {
        before(function() {
          this.authenticate = Authentication(sequelize, test.options)
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

          this.authenticate(options, {}, function() {
            expect(1).toEqual(1)
            done()
          })
        })
      })
    }.bind(this))
  })

  describe('scope option', function() {
    before(function() {
      this.authenticate = Authentication(sequelize, { via: 'params', scope: '/scope' })
    })

    it('ignores missing credentials for urls which are out of scope', function(done) {
      this.authenticate({ headers: {}, query: {}, body: {}, path: '/' }, {}, function() {
        expect(1).toEqual(1)
        done()
      })
    })

    it('raises an error if credentials are wrong within the scope', function(done) {
      this.authenticate({ headers: {}, query: { user: uuid.v1(), password: uuid.v1() }, body: {}, path: '/scope/fnord' }, {
        end: function(msg) {
          expect(msg).toEqual('Unauthorized')
          done()
        }
      }, function() {
        expect(1).toEqual(1)
        done()
      })
    })

    it('calls the passed function if credentials are correct', function(done) {
      this.authenticate({ headers: {}, query: { user: 'root', password: '' }, body: {}, path: '/scope/fnord' }, {}, function() {
        expect(1).toEqual(1)
        done()
      })
    })
  })

  describe('param option', function() {
    before(function() {
      this.authenticate = Authentication(sequelize, { param: 'authentication' })
    })

    it('uses the authentication parameter in the qery', function(done) {
      this.authenticate({
        headers: {},
        query: { authentication: { user: 'root', password: '' } },
        body: {}
      }, {}, function() {
        expect(1).toEqual(1)
        done()
      })
    })

    it('uses the authentication parameter in the post body', function(done) {
      this.authenticate({
        headers: {},
        query: {},
        body: { authentication: { user: 'root', password: '' } }
      }, {}, function() {
        expect(1).toEqual(1)
        done()
      })
    })

    it('uses the authentication parameter in the header', function(done) {
      this.authenticate = Authentication(sequelize, { param: 'authentication', via: 'headers' })
      this.authenticate({
        headers: { authentication: { user: 'root', password: '' } },
        query: {},
        body: {}
      }, {}, function() {
        expect(1).toEqual(1)
        done()
      })
    })
  })
})
