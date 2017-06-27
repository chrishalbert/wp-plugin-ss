var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var https = require('https');

var ResultsPage = require ("../lib/results-page");

var PromiseResultsPage = Promise.method(function(url) {
    return new Promise(function(resolve, reject) {
        var request = https.get(url, function (response) {
            var body = '';
            response.on('data', function (data) {
                body += data;
            });

            response.on('end', function() {
                resolve(new ResultsPage(body));
            });
        });

        request.on('error', function(error) {
            reject(error);
        });

        request.end();
    });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/plugins', function(req, res, next) {
  var plugins = [],
      search = req.query.search.replace(/ /g,"+");

  var response = PromiseResultsPage('https://wordpress.org/plugins/search/' + search)
      .then(function processLandingResultsPage(landingResultsPage) {
          plugins = plugins.concat(landingResultsPage.getAllPlugins());
          return landingResultsPage.getAllResultsPages();
      })
      .then(function processSubsequentResultsPages(subsequentResultsPages) {
          subsequentResultsPages.forEach(function (url) {
            var request = PromiseResultsPage(url)
                .then(function(resultsPage) {
                    plugins = plugins.concat(resultsPage.getAllPlugins());
                });
          });
          res.send(plugins);
      });
});

module.exports = router;
