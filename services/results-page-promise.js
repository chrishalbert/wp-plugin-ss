const ResultsPage = require('../lib/results-page');
const https = require('https');
const winston = require('winston');

module.exports = function resultsPagePromise(url) {
  return new Promise((resolve, reject) => {
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
      winston.error(url, error);
      reject(error);
    });

    request.end();
  });
};
