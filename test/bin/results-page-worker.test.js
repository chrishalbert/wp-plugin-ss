const nock = require('nock');
const fs = require('fs');
const assert = require('assert');
const mock = require('mock-require');
const redisMock = require('redis-mock');
const mongoMock = require('mongo-mock');
mock('redis', redisMock);
mock('mongodb', mongoMock);
const redis = require('redis');
const redisClient = redis.createClient({url: process.env.WP_PLUGIN_SS_REDIS_URL});
const mongo = require('mongodb');

const mongoDbUri = process.env.WP_PLUGIN_SS_MONGODB_URI;

describe('bin/results-page-worker', function() {
  let html = '';

  beforeEach(function (done) {
    fs.readFile(__dirname + '/../data/one-results-page.html', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      html = data;
      nock('https://wordpress.org')
        .get('/plugins/?s=')
        .reply(200, html);
      redisClient.rpush([process.env.WP_PLUGIN_SS_REDIS_QUEUE, 'https://wordpress.org/plugins/?s='], function() {
        done();
      });
    });
  });

  afterEach(function (done) {
    redisClient.flushall(function() {
      done();
    });
  });

  it('upserted 12 plugins into mongo', function resultsPagePromiseEnder(done) {
    const resultsPageWorker = require('./../../bin/results-page-worker');
    resultsPageWorker().then(function() {
      mongo.MongoClient.connect(mongoDbUri, function (err, db) {
        db.collection('plugins').count({},
          function(err,results) {
            assert.equal(12, results);
            done();
          }
        );
      });
    });
  }).timeout(10000);
});
