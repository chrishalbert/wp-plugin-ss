var request = require('supertest');
var nock = require('nock');
var fs = require('fs');
var assert = require('assert');

describe('routes/plugins', function() {
  var server;

  beforeEach(function () {
    delete require.cache[require.resolve('./../../bin/www')];
    server = require('./../../bin/www');
    fs.readFile(process.env.ROOT_DIR + 'test/data/one-results-page.html', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      nock('https://wordpress.org')
        .get('/plugins/search/ibericode')
        .reply(200, data);
      nock('https://wordpress.org')
        .get('/plugins/search/ibericode/1')
        .reply(200, data);
    });
  });

  afterEach(function () {
    server.close();
  });

  it('fails to load base path /', function testBasePath(done) {
    request(server).get('/').expect(404, done);
  });

  it('loads plugins on search /plugins?search=ibericode', function loadsPlugins(done) {
    request(server).get('/plugins?search=ibericode').expect(200, done);
  });

  it('sorts plugins ascending /plugins?search=ibericode&sort=name', function sortsByNameAsc(done) {
    request(server).get('/plugins?search=ibericode&sort=name').expect(200)
      .expect(function(res) {
        assert.equal(res.body[0].name, 'Boxzilla');
      })
      .end(function(err) {
        done(err);
      });
  });

  it('sorts plugins descending /plugins?search=ibericode&sort=-name', function sortsByNameDesc(done) {
    request(server).get('/plugins?search=ibericode&sort=-name').expect(200)
      .expect(function(res) {
        assert.equal(res.body[0].name, 'WP Newsletter Subscription');
      })
      .end(function(err) {
        done(err);
      });  });

  it('sorts plugins by multiple params /plugins?search=ibericode&sort=author,installs', function sortsByAuthorInstalls(done) {
    request(server).get('/plugins?search=ibericode&sort=author,installs').expect(200)
      .expect(function(res) {
        assert.equal(res.body[1].name, 'MailChimp for Wordpress - WPML Integration');
      })
      .end(function(err) {
        done(err);
      });  });
});