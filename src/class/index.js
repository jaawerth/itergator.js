'use strict';

const typed = require('./type-iterators');
const RangeIterator = require('./range-iterator');
const { MappingIterator } = require('./mapping-iterators');
const toIterator = require('../methods/to-iterator');
function IterGator(value) {
  this._wrapped = value;
}

IterGator.prototype[Symbol.iterator] = function gatorIterator() {
  return toIterator(this._wrapped);
};
  




module.exports = Object.assign({}, typed, {IterGator, MappingIterator, RangeIterator});