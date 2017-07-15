#!/usr/bin/env node
var MongoClient = require('mongodb').MongoClient;
const https = require('https');
const filters = require('../lib/filters');
const redis = require("redis");
const redisClient = redis.createClient();

redisClient.send_command('rpop', ['list'], function (listName, url) {
  const resultsPagePromise = require("../services/results-page-promise")(url);

  resultsPagePromise.then((resultsPage) => {
    var url = 'mongodb://localhost:27017/test';

    MongoClient.connect(url, function(err, db) {
      let plugins = resultsPage.getAllPlugins();
      var collection  = db.collection('plugins');
      plugins.forEach(function (plugin) {
        collection.updateOne({name: plugin.name}, {$set: plugin}, {upsert: true});
        console.log(plugin.name);
      });
      setTimeout(function() {
        db.close();
        process.exit(-1);
      }, 1000);
    });
  });
});
