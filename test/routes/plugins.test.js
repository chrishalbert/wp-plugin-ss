var request = require('supertest');
var nock = require('nock');
var fs = require('fs');
var assert = require('assert');

describe('routes/plugins', function() {
  var server;

  beforeEach(function () {
    delete require.cache[require.resolve('./../../bin/www')];
    server = require('./../../bin/www');
    fs.readFile(__dirname + '/../data/one-results-page.html', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      nock('https://wordpress.org')
        .get('/plugins/search/ibericode/')
        .reply(200, data);
      nock('https://wordpress.org')
        .get('/plugins/search/ibericode/page/1')
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
        assert.equal(res.body.length, 12);
      })
      .end(function(err) {
        done(err);
      });
  });

  it('sorts plugins descending /plugins?search=ibericode&sort=-name', function sortsByNameDesc(done) {
    request(server).get('/plugins?search=ibericode&sort=-name').expect(200)
      .expect(function(res) {
        assert.equal(res.body[0].name, 'WP Newsletter Subscription');
        assert.equal(res.body.length, 12);
      })
      .end(function(err) {
        done(err);
      });
  });

  it('sorts plugins by multiple params /plugins?search=ibericode&sort=author,installs', function sortsByAuthorInstalls(done) {
    request(server).get('/plugins?search=ibericode&sort=author,installs').expect(200)
      .expect(function(res) {
        assert.equal(res.body[1].name, 'MailChimp for WordPress – WPML Integration');
        assert.equal(res.body.length, 12);
      })
      .end(function(err) {
        done(err);
      });
  });

  it('filters by author /plugins?search=ibericode&author=ibericode', function filterByAuthor(done) {
    request(server).get('/plugins?search=ibericode&author=ibericode').expect(200)
      .expect(function(res) {
        assert.equal(res.body.length, 10);
      })
      .end(function(err) {
        done(err);
      });
  });

  it('filters by minRating /plugins?search=ibericode&minRating=5', function filterByAuthor(done) {
    request(server).get('/plugins?search=ibericode&minRating=5').expect(200)
      .expect(function(res) {
        assert.equal(res.body.length, 7);
      })
      .end(function(err) {
        done(err);
      });
  });

  it('filters by maxRating /plugins?search=ibericode&maxRating=0', function filterByAuthor(done) {
    request(server).get('/plugins?search=ibericode&maxRating=0').expect(200)
      .expect(function(res) {
        assert.equal(res.body.length, 2);
      })
      .end(function(err) {
        done(err);
      });
  });

  it('filters by minReviews /plugins?search=ibericode&minReviews=100', function filterByAuthor(done) {
    request(server).get('/plugins?search=ibericode&minReviews=100').expect(200)
      .expect(function(res) {
        assert.equal(res.body.length, 1);
      })
      .end(function(err) {
        done(err);
      });
  });

  it('filters by maxReviews /plugins?search=ibericode&maxReviews=10', function filterByAuthor(done) {
    request(server).get('/plugins?search=ibericode&maxReviews=10').expect(200)
      .expect(function(res) {
        assert.equal(res.body.length, 5);
      })
      .end(function(err) {
        done(err);
      });
  });

  it('filters by minInstalls /plugins?search=ibericode&minInstalls=1000', function filterByAuthor(done) {
    request(server).get('/plugins?search=ibericode&minInstalls=1000').expect(200)
      .expect(function(res) {
        assert.equal(res.body.length, 9);
      })
      .end(function(err) {
        done(err);
      });
  });

  it('filters by maxInstalls /plugins?search=ibericode&maxInstalls=5000', function filterByAuthor(done) {
    request(server).get('/plugins?search=ibericode&maxInstalls=5000').expect(200)
      .expect(function(res) {
        assert.equal(res.body.length, 5);
      })
      .end(function(err) {
        done(err);
      });
  });

  it('filters by minVersion /plugins?search=ibericode&minVersion=4.7', function filterByAuthor(done) {
    request(server).get('/plugins?search=ibericode&minVersion=4.7').expect(200)
      .expect(function(res) {
        assert.equal(res.body.length, 8);
      })
      .end(function(err) {
        done(err);
      });
  });

  it('filters by maxVersion /plugins?search=ibericode&maxVersion=4.6', function filterByAuthor(done) {
    request(server).get('/plugins?search=ibericode&maxVersion=4.6').expect(200)
      .expect(function(res) {
        assert.equal(res.body.length, 2);
      })
      .end(function(err) {
        done(err);
      });
  });
});