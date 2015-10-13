'use strict';
const { TakeIterator } = require('../class/take-iterator');

module.exports = function iteratorTake(length, iterator) {
  return new TakeIterator(length, iterator);
};