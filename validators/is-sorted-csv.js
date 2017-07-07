module.exports = function isSortedCsv(value) {
  if (typeof value === 'undefined') {
    return true;
  }
  const sortables = ['ratings', 'reviews', 'installs', 'author', 'name', 'version'];
  const sort = value.split(',');
  for (let i = 0; i < sort.length; i += 1) {
    // If i.e. 'ratings' or '-ratings' is not in the sortables array
    const sortInvalid = !sortables.includes(sort[i]);
    const minusSortInvalid = sort[i][0] !== '-' && !sortables.includes(sort[i].substring(1));
    if (sortInvalid && minusSortInvalid) {
      return false;
    }
  }
  return true;
};
