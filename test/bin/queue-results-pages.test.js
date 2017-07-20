const nock = require('nock');
const fs = require('fs');
const assert = require('assert');
const mock = require('mock-require');
const redisMock = require('redis-mock');
mock('redis', redisMock);
const redis = require('redis');
const redisClient = redis.createClient();

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
      redisClient.llen('list', function (err, value) {
        assert.equal(value, 614);
        done();
      });
    });
  });
});