'use strict';

const typed = require('./type-iterators');
const toIterator = require('../methods/to-iterator');
class IterGator {
  constructor(value) {
    this._wrapped = value;
  }
  [Symbol.iterator]() {
    return toIterator(this._wrapped);
  }
}



module.exports = Object.assign({}, typed);