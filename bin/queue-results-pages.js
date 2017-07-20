#!/usr/bin/env node

const resultsPagePromise = require('../services/results-page-promise')('https://wordpress.org/plugins/?s=');
const redis = require('redis');

// Add ability to accept options
const redisClient = redis.createClient();

module.exports = function queueResultsPages() {
// Push results pages to our redisClient
  return resultsPagePromise.then(resultsPage => resultsPage.getAllResultsPages())
    .then((urls) => {
      urls.forEach((url) => {
        redisClient.lpush([process.env.WP_PLUGIN_SS_REDIS_QUEUE, url], () => {
        });
      });
    });
};
