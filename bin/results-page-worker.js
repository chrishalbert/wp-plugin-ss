#!/usr/bin/env node
const MongoClient = require('mongodb').MongoClient;
const redis = require('redis');
const ResultsPagePromise = require('../services/results-page-promise');
const winston = require('winston');

const redisClient = redis.createClient();
const host = process.env.WP_PLUGIN_SS_MONGO_HOST;
const port = process.env.WP_PLUGIN_SS_MONGO_PORT;
const database = process.env.WP_PLUGIN_SS_MONGO_DB;

module.exports = function resultsPageWorker() {
  return new Promise((resolve) => {
    redisClient.rpop([process.env.WP_PLUGIN_SS_REDIS_QUEUE], (err, wpUrl) => {
      winston.info(`${wpUrl} (pending scraping)`);
      const resultsPagePromise = new ResultsPagePromise(wpUrl);
      resultsPagePromise.then((resultsPage) => {
        MongoClient.connect(`mongodb://${host}:${port}/${database}`).then((db) => {
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
