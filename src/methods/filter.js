'use strict';
const FilterIterator = require('../class').FilterIterator;

module.exports = filter;
function filter(predicate, iterator) {
  return new FilterIterator(predicate, iterator);
}