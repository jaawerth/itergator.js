'use strict';
const toIterator = require('./to-iterator');

function toArray() {
  const iter = toIterator(this);
  const result = [];
  for (let nextVal = iter.next(); !nextVal.done; nextVal = iter.next()) {
    result.push(nextVal.value);
  }
  return result;
}

module.exports = Array.from || toArray;