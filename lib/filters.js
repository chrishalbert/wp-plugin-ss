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
    return {rating: {$gte: parseInt(val)}};
  },
  maxRating: function maxRating(val) {
    return {rating: {$lte: val}};
  },
  minReviews: function minReviews(val) {
    return {reviews: {$gte: val}};
  },
  maxReviews: function maxReviews(val) {
    return {reviews: {$lte: val}};
  },
  minInstalls: function minInstalls(val) {
    return {installs: {$gte: val}};
  },
  maxInstalls: function maxInstalls(val) {
    return {installs: {$lte: val}};
  },
  minVersion: function minVersion(val) {
    return {testedVersion: {$gte: val}};
  },
  maxVersion: function maxVersion(val) {
    return {testedVersion: {$lte: val}};
  }
};
