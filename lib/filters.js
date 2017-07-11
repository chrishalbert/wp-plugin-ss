const lte = function (v1, v2) {
  return v1 <= v2;
};

const gte = function (v1, v2) {
  return v1 >= v2;
};

const equal = function (v1, v2) {
  return v1 === v2;
};

module.exports = {
  author: {
    property: 'author',
    comparison: equal
  },
  minRating: {
    property: 'rating',
    comparison: lte
  },
  maxRating: {
    property: 'rating',
    comparison: gte
  },
  minReviews: {
    property: 'reviews',
    comparison: lte
  },
  maxReviews: {
    property: 'reviews',
    comparison: gte
  },
  minInstalls: {
    property: 'installs',
    comparison: lte
  },
  maxInstalls: {
    property: 'installs',
    comparison: gte
  },
  minVersion: {
    property: 'testedVersion',
    comparison: lte,
  },
  maxVersion: {
    property: 'testedVersion',
    comparison: gte
  }
};
