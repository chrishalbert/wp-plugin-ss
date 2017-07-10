var request = require('supertest');
describe('validators/is-sorted-csv', function() {
  var server;
  beforeEach(function () {
    delete require.cache[require.resolve('./../../bin/www')];
    server = require('./../../bin/www');
  });
  afterEach(function () {
    server.close();
  });
  it('fails with invalid sort params /plugins?search=yes&sort=invalidSort', function testPluginWithNoParams(done) {
    request(server).get('/plugins?search=yes&sort=invalidSort').expect(400, /Must have valid sort values./, done);
  });
});