const nock = require('nock');
const fs = require('fs');
const assert = require('assert');

describe('services/results-page-promise', function() {
  let html = '';

  beforeEach(function (done) {
    delete require.cache[require.resolve('./../../services/results-page-promise')];
    fs.readFile(__dirname + '/../data/one-results-page.html', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      html = data;
      done();
    });
  });

  it('loads the results page properties on response.end', function resultsPagePromiseEnder(done) {
    nock('https://wordpress.org')
      .get('/plugins/?s=ibericode')
      .reply(200, html);
    const resultsPagePromise = require('./../../services/results-page-promise')('https://wordpress.org/plugins/?s=ibericode');
    resultsPagePromise.then(function(resultsPage) {
      assert.equal(resultsPage.getAllResultsPages().length, 1);
      assert.equal(resultsPage.getAllPlugins().length, 12);
      done();
    });
  });

  it('logs an error on request.error', function resultsPagePromiseErrorer(done) {
    nock('https://wordpress.org')
      .get('/plugins/?s=ibericode')
      .replyWithError('FAILURE!');

    const resultsPagePromise = require('./../../services/results-page-promise');
    resultsPagePromise('https://wordpress.org/plugins/?s=ibericode').catch(
      function(err) {
        assert.equal(err, 'Error: FAILURE!');
        done();
    }).catch(done);
  });
});