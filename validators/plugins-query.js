module.exports = {
  'search': {
    in: 'query',
    notEmpty: 'true',
    isLength: {
      options: [{ min: 3}]
    },
    errorMessage: 'Must be 3 characters.'
  },
  'author': {
    in: 'query',
    optional: true,
  },
  'minRatings': {
    in: 'query',
    optional: true,
    isInt: true,
    errorMessage: 'Must be an integer.'
  },
  'maxRatings': {
    in: 'query',
    optional: true,
    isInt: true,
    errorMessage: 'Must be an integer.'
  },
  'minReviews': {
    in: 'query',
    optional: true,
    isInt: true,
    errorMessage: 'Must be an integer.'
  },
  'maxReviews': {
    in: 'query',
    optional: true,
    isInt: true,
    errorMessage: 'Must be an integer.'
  },
  'minInstalls': {
    in: 'query',
    optional: true,
    isInt: true,
    errorMessage: 'Must be an integer.'
  },
  'maxInstalls': {
    in: 'query',
    optional: true,
    isInt: true,
    errorMessage: 'Must be an integer.'
  },
  'minVersion': {
    in: 'query',
    optional: true,
  },
  'maxVersion': {
    in: 'query',
    optional: true,
  },
};