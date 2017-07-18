const express = require('express');
const router = express.Router();
const pluginsQuery = require('../validators/plugins-query');
const filters = require('../lib/filters');
const MongoClient = require('mongodb').MongoClient;

function buildQuery(reqQuery) {
  let query = {$and: []};
  const filterKeys = Object.keys(filters);
  filterKeys.forEach(function (key) {
    if (key in reqQuery) {
      query.$and.push(filters[key](reqQuery[key]));
    }
  });
  return query;
}

function buildSorts(sorts) {
  let mongoSort = {};
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
  const search = ('search' in req.query) ? req.query.search.trim() : '';
  const sorts = ( 'sort' in req.query) ? req.query.sort.split(',') : [];
  const mongoQuery = buildQuery(req.query);
  const mongoSort = buildSorts(sorts);

  req.checkQuery(pluginsQuery);
  req.checkQuery('sort', 'Must have valid sort values.').isSortedCsv();

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return res.status(400).send(result.array());
    }

    MongoClient.connect('mongodb://localhost:27017/test', (err,db) => {
      db.collection('plugins').find(mongoQuery).sort(mongoSort).toArray(function(err, items) {
        res.send(items);
        db.close();
      });
    });
  });
});

module.exports = router;
