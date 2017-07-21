var request = require('supertest');
var nock = require('nock');
var assert = require('assert');
var mock = require('mock-require');
var mongoMock = require('mongo-mock');
mock('mongodb', mongoMock);
var mongodb = require('mongodb');
var mockMongoClient = mongodb.MongoClient;

var ibericode = require('./../data/ibericode.js');

before(function () {
  mockMongoClient.connect('mongodb://localhost:27017/test', {}, function(err, db) {
    db.collection('plugins').insert(ibericode.dump, function (err, result) {
      setTimeout(db.close, 1000);
    });
  });
});

describe('routes/plugins', function() {
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

  it('loads plugins on search /plugins?search=ibericode', function loadsPlugins(done) {
    request(server).get('/plugins?search=ibericode').expect(200)
      .end((err) => done(err));
  });

  it('sorts plugins ascending /plugins?search=ibericode&sort=name', function sortsByNameAsc(done) {
    request(server).get('/plugins?search=ibericode&sort=name').expect(200)
      .expect(function(res) {
        assert.equal(res.body[0].name, 'Boxzilla');
        assert.equal(res.body.length, 10);
      })
      .end(function(err) {
        done(err);
      });
  });

  it('sorts plugins descending /plugins?search=ibericode&sort=-name', function sortsByNameDesc(done) {
    request(server).get('/plugins?search=ibericode&sort=-name').expect(200)
      .expect(function(res) {
        assert.equal(res.body[0].name, 'Social Sharing (by Danny)');
        assert.equal(res.body.length, 10);
      })
      .end(function(err) {
        done(err);
      });
  });

  it('sorts plugins by multiple params /plugins?search=ibericode&sort=ratings,-reviews', function sortsByAuthorInstalls(done) {
    request(server).get('/plugins?search=ibericode&sort=-ratings,-reviews').expect(200)
      .expect(function(res) {
        assert.equal(res.body[1].name, 'Scroll Triggered Boxes');
        assert.equal(res.body.length, 10);
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
        assert.equal(res.body.length, 1);
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
        assert.equal(res.body.length, 4);
      })
      .end(function(err) {
        done(err);
      });
  });

  it('filters by minInstalls /plugins?search=ibericode&minInstalls=1000', function filterByAuthor(done) {
    request(server).get('/plugins?search=ibericode&minInstalls=1000').expect(200)
      .expect(function(res) {
        assert.equal(res.body.length, 8);
      })
      .end(function(err) {
        done(err);
      });
  });

  it('filters by maxInstalls /plugins?search=ibericode&maxInstalls=5000', function filterByAuthor(done) {
    request(server).get('/plugins?search=ibericode&maxInstalls=5000').expect(200)
      .expect(function(res) {
        assert.equal(res.body.length, 4);
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
        assert.equal(res.body.length, 1);
      })
      .end(function(err) {
        done(err);
      });
  });
});