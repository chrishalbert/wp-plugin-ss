const nock = require('nock');
const fs = require('fs');
const assert = require('assert');
const mock = require('mock-require');
const redisMock = require('redis-mock');
mock('redis', redisMock);
const redis = require('redis');
const redisClient = redis.createClient({url: process.env.WP_PLUGIN_SS_REDIS_URL});

describe('bin/queue-results-pages', function() {
  let html = '';

  beforeEach(function (done) {
    fs.readFile(__dirname + '/../data/results-page.html', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      html = data;
      done();
    });
  });

  it('LPUSHes 614 plugins into redis', function resultsPagePromiseEnder(done) {
    nock('https://wordpress.org')
      .get('/plugins/?s=')
      .reply(200, html);
    const queueResultsPages = require('./../../bin/queue-results-pages.js');
    queueResultsPages().then(function() {
      redisClient.llen(process.env.WP_PLUGIN_SS_REDIS_QUEUE, function (err, value) {
        assert.equal(value, 614);
        done();
      });
    });
  });
});