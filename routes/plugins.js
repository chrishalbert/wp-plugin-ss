const express = require('express');

const router = express.Router();
const Promise = require('bluebird');
const https = require('https');
const pluginsQuery = require('../validators/plugins-query');
const firstBy = require('thenby');
const filters = require('../lib/filters');

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
  const search = ('search' in req.query) ? req.query.search.trim().replace(/ /g, '+') : '';

  req.checkQuery(pluginsQuery);
  req.checkQuery('sort', 'Must have valid sort values.').isSortedCsv();

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.status(400).send(result.array());
    }

    const sorts = typeof req.query.sort === 'undefined' ? [] : req.query.sort.split(',');

    const resultsPagesPromise = PromiseResultsPage(`https://wordpress.org/plugins/search/${search}/`)
      .then(landingResultsPage => landingResultsPage.getAllResultsPages())
      .then((subsequentResultsPages) => {
        subsequentResultsPages.forEach((url) => {
          allPages.push(PromiseResultsPage(url).then((resultsPage) => {
            plugins = plugins.concat(resultsPage.getAllPlugins());
          }));
        });
        return allPages;
      });

    return Promise.all(resultsPagesPromise).then(() => {
      let thenBySort;

      const queryParams = Object.keys(filters);
      // Apply filter by looping through the available filters
      for (let i = 0; i < queryParams.length; i += 1) {
        // If the filter is in the query string
        const queryParam = queryParams[i];
        if (queryParam in req.query) {
          // Apply it
          plugins = plugins.filter(plugin =>
            filters[queryParam].comparison(
              req.query[queryParam],
              plugin[filters[queryParam].property]));
        }
      }

      sorts.forEach((sortParam, i) => {
        let direction = 1;
        let param = sortParam;
        if (sortParam[0] === '-') {
          direction = -1;
          param = sortParam.substring(1);
        }
        if (i === 0) {
          thenBySort = firstBy(param, direction);
        } else {
          thenBySort = thenBySort.thenBy(param, direction);
        }
      });

      if (sorts.length) {
        plugins.sort(thenBySort);
      }

      res.send(plugins);
    });
  });
});

module.exports = router;
