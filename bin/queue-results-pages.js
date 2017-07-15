#!/usr/bin/env node

// Accept optional search param at some point
const resultsPagePromise = require('../services/results-page-promise')('https://wordpress.org/plugins/?s=');
const redis = require('redis');

// Add ability to accept options
const redisClient = redis.createClient();

// Push results pages to our redisClient
resultsPagePromise.then(resultsPage => resultsPage.getAllResultsPages())
  .then((urls) => {
    urls.forEach((url) => {
      redisClient.send_command('LPUSH', ['list', url]);
    });
    process.exit(-1);
  });
