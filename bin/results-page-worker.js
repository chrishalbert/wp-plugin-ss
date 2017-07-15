#!/usr/bin/env node
const MongoClient = require('mongodb').MongoClient;
const redis = require('redis');
const ResultsPagePromise = require('../services/results-page-promise');
const winston = require('winston');

const redisClient = redis.createClient();

redisClient.send_command('rpop', ['list'], (listName, wpUrl) => {
  winston.info(`${wpUrl} (pending scraping)`);
  const resultsPagePromise = new ResultsPagePromise(wpUrl);
  resultsPagePromise.then((resultsPage) => {
    MongoClient.connect('mongodb://localhost:27017/test', (err, db) => {
      const plugins = resultsPage.getAllPlugins();
      const collection = db.collection('plugins');
      plugins.forEach((plugin) => {
        collection.updateOne({ name: plugin.name }, { $set: plugin }, { upsert: true });
        winston.info(`${plugin.name} (upserted)`);
      });
      setTimeout(() => {
        db.close();
        process.exit(-1);
      }, 1000);
    });
  });
});
