#!/usr/bin/env node
const MongoClient = require('mongodb').MongoClient;
const redis = require('redis');
const ResultsPagePromise = require('../services/results-page-promise');
const winston = require('winston');

const redisClient = redis.createClient();

module.exports = function resultsPageWorker() {
  return new Promise((resolve) => {
    redisClient.rpop(['list'], (err, wpUrl) => {
      winston.info(`${wpUrl} (pending scraping)`);
      const resultsPagePromise = new ResultsPagePromise(wpUrl);
      resultsPagePromise.then((resultsPage) => {
        MongoClient.connect('mongodb://localhost:27017/test', (mongoErr, db) => {
          const plugins = resultsPage.getAllPlugins();
          const collection = db.collection('plugins');
          let processedPlugins = 0;
          plugins.forEach((plugin) => {
            collection.update({ name: plugin.name }, { $set: plugin }, { upsert: true }, () => {
              winston.info(`${plugin.name} (upserted)`);
              processedPlugins += 1;
              if (processedPlugins === plugins.length) {
                db.close();
                resolve();
              }
            });
          });
        });
      });
    });
  });
};
