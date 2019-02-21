var should = require('should');
var app = require('../server');
var request = require('supertest')(app);
const validUserData = require('../test/test_common')
describe('useless api endpoint', function() {
  var token;
  before(function(done) {
    request.post('/api/users/login')
      .send(validUserData)
      .end(function(err, res) {
        if (err) throw err;
        token = { access_token: res.body.token }
        done();
      });
  });
  
  it('posts an object', function(done) {
    request.post('/api/users/login')
      .send(validUserData)
      .query(token)
      .expect(201)
      .end(function(err, res) {
        should(err).equal(null);
        done()
      });
  });
});