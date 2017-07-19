module.exports = {
  search: function search(val) {
    return {
      $or: [
        {author: new RegExp(val)},
        {description: new RegExp(val)},
        {name: new RegExp(val)}
      ]
    };
  },
  minRating: function minRating(val) {
    return {rating: {$gte: parseInt(val, 10)}};
  },
  maxRating: function maxRating(val) {
    return {rating: {$lte: parseInt(val, 10)}};
  },
  minReviews: function minReviews(val) {
    return {reviews: {$gte: parseInt(val, 10)}};
  },
  maxReviews: function maxReviews(val) {
    return {reviews: {$lte: parseInt(val, 10)}};
  },
  minInstalls: function minInstalls(val) {
    return {installs: {$gte: parseInt(val, 10)}};
  },
  maxInstalls: function maxInstalls(val) {
    return {installs: {$lte: parseInt(val, 10)}};
  },
  minVersion: function minVersion(val) {
    return {testedVersion: {$gte: val}};
  },
  maxVersion: function maxVersion(val) {
    return {testedVersion: {$lte: val}};
  }
};
