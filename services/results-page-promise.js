const ResultsPage = require('../lib/results-page');
const https = require('https');
const Promise = require('bluebird');

module.exports = ResultsPagePromise = Promise.method(url => new Promise((resolve, reject) => {
  const request = https.get(url, (response) => {
    let body = '';
    response.on('data', (data) => {
      body += data;
    });

    response.on('end', () => {
      resolve(new ResultsPage(body));
      body = null;
    });
  });

  request.on('error', (error) => {
    console.log(url);
    reject(error);
  });

  request.end();
}));