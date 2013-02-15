var buster         = require('buster')
  , Authentication = require(__dirname + '/../lib/index')
  , uuid           = require('node-uuid')
  , Sequelize      = require('sequelize-postgres').sequelize
  , sequelize      = new Sequelize('sequelize_test', 'root', null, { logging: false })

buster.spec.expose()

describe('sequelize-authentication', function() {
  describe('authentication data in query', function() {
    before(function() {
      this.authenticate = Authentication(sequelize, { credentialSource: 'query' })
    })

    it('raises an error if authentication fails', function(done) {
      this.authenticate({
        query:   { user: uuid.v1(), password: uuid.v1() },
        headers: {}
      }, {
        end: function(msg) {
          expect(msg).toEqual('Unauthorized')
          done()
        }
      }, function(){})
    })

    it('calls the passed function if credentials are correct', function(done) {
      this.authenticate({
        query:   { user: 'root', password: '' },
        headers: {}
      }, {}, function(){
        expect(1).toEqual(1)
        done()
      })
    })
  })
})
