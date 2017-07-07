var request = require('supertest');
describe('www', function() {
  var server;
  beforeEach(function () {
    delete require.cache[require.resolve('./../../bin/www')];
    server = require('./../../bin/www');
  });
  afterEach(function () {
    server.close();
  });
  it('fails to load base path /', function testBasePath(done) {
    request(server).get('/').expect(404, done);
  });
  it('fails with search  /', function testBasePath(done) {
    request(server).get('/').expect(404, done);
  });
  it('fails without search', function testPluginWithNoParams(done) {
    request(server).get('/plugins').expect(400, /Must be 3 characters./, done);
  });
  it('fails with search less than 3 characters /plugins?search=no', function testPluginWithNoParams(done) {
    request(server).get('/plugins?search=no').expect(400, /Must be 3 characters./, done);
  });
  it('fails with minRatings not an integer /plugins?search=yes&minRatings=no', function testPluginWithNoParams(done) {
    request(server).get('/plugins?search=yes&minRatings=no').expect(400, /Must be an integer./, done);
  });
  it('fails with maxRatings not an integer /plugins?search=yes&maxRatings=no', function testPluginWithNoParams(done) {
    request(server).get('/plugins?search=yes&maxRatings=no').expect(400, /Must be an integer./, done);
  });
  it('fails with minReviews not an integer /plugins?search=yes&minReviews=no', function testPluginWithNoParams(done) {
    request(server).get('/plugins?search=yes&minReviews=no').expect(400, /Must be an integer./, done);
  }); 
  it('fails with maxReviews not an integer /plugins?search=yes&maxReviews=no', function testPluginWithNoParams(done) {
    request(server).get('/plugins?search=yes&maxReviews=no').expect(400, /Must be an integer./, done);
  });
  it('fails with minInstalls not an integer /plugins?search=yes&minInstalls=no', function testPluginWithNoParams(done) {
    request(server).get('/plugins?search=yes&minInstalls=no').expect(400, /Must be an integer./, done);
  });
  it('fails with maxInstalls not an integer /plugins?search=yes&maxInstalls=no', function testPluginWithNoParams(done) {
    request(server).get('/plugins?search=yes&maxInstalls=no').expect(400, /Must be an integer./, done);
  });
});