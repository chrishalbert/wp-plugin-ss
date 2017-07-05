const express = require('express');

const router = express.Router();
const Promise = require('bluebird');
const https = require('https');

const ResultsPage = require('../lib/results-page');

const PromiseResultsPage = Promise.method(url => new Promise((resolve, reject) => {
  const request = https.get(url, (response) => {
    let body = '';
    response.on('data', (data) => {
      body += data;
    });

    response.on('end', () => {
      resolve(new ResultsPage(body));
    });
  });

  request.on('error', (error) => {
    reject(error);
  });

  request.end();
}));

router.get('/plugins', (req, res) => {
  let plugins = [];
  const allPages = [];
  const search = req.query.search.replace(/ /g, '+');

  const response = PromiseResultsPage(`https://wordpress.org/plugins/search/${search}`)
      .then((landingResultsPage) => {
        plugins = plugins.concat(landingResultsPage.getAllPlugins());
        return landingResultsPage.getAllResultsPages();
      })
      .then((subsequentResultsPages) => {
        subsequentResultsPages.forEach((url) => {
          allPages.push(PromiseResultsPage(url).then((resultsPage) => {
            plugins = plugins.concat(resultsPage.getAllPlugins());
          }));
        });
        return allPages;
          // res.send(plugins);
      });

  Promise.all(response).then(() => {
    res.send(plugins);
  });
});

module.exports = router;
