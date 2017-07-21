const express = require('express');

const router = express.Router();
const pluginsQuery = require('../validators/plugins-query');
const filters = require('../lib/filters');
const MongoClient = require('mongodb').MongoClient;

/**
 * Builds a mongo query based off the querystring.
 * @param {{}} reqQuery - Http query string object.
 * @returns {{$and: Array}} A mongo formatted object.
 */
function buildQuery(reqQuery) {
  const query = { $and: [] };
  const filterKeys = Object.keys(filters);
  filterKeys.forEach((key) => {
    if (key in reqQuery) {
      query.$and.push(filters[key](reqQuery[key]));
    }
  });
  return query;
}

/**
 * Builds a mongo sort object based off the sorts param.
 * @param {string} sorts - A csv of sort keys.
 * @returns {{}} A mongo formatted sort object.
 */
function buildSorts(sorts) {
  const mongoSort = {};
  sorts.forEach((sortParam) => {
    let direction = 1;
    let param = sortParam;
    if (sortParam[0] === '-') {
      direction = -1;
      param = sortParam.substring(1);
    }
    mongoSort[param] = direction;
  });
  return mongoSort;
}

router.get('/plugins', (req, res) => {
  const sorts = ('sort' in req.query) ? req.query.sort.split(',') : [];
  const mongoQuery = buildQuery(req.query);
  const mongoSort = buildSorts(sorts);

  req.checkQuery(pluginsQuery);
  req.checkQuery('sort', 'Must have valid sort values.').isSortedCsv();

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.status(400).send(result.array());
    }

    return MongoClient.connect('mongodb://localhost:27017/test', (dbErr, db) => db.collection('plugins').find(mongoQuery).sort(mongoSort).toArray((err, items) => {
      db.close();
      return res.send(items);
    }));
  });
});

module.exports = router;
