'use strict';
var RangeIterator = require('../class/range-iterator');
module.exports = function rangeIterator(start, end) {
  return new RangeIterator(start, end);
};
