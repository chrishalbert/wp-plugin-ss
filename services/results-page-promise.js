const ResultsPage = require('../lib/results-page');
const https = require('https');
const Promise = require('bluebird');
const winston = require('winston');

module.exports = Promise.method(url => new Promise((resolve, reject) => {
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
    winston.error(url, error);
    reject(error);
  });

  request.end();
}));
