module.exports = function isSortedCsv (value) {
    if (typeof value === 'undefined') {
      return true;
    }
    const sortables = ['ratings', 'reviews', 'installs', 'author', 'name', 'version'];
    const sort = value.split(',');
    for (let i = 0; i < sort.length; i++) {
      // If 'ratings' or '-ratings' for i.e. are in the csv continue, else return false
      if (sortables.includes(sort[i]) || (sort[i][0] === '-' && sortables.includes(sort[i].substring(1)))) {
        continue;
      }
      return false;
    }
    return true;
};