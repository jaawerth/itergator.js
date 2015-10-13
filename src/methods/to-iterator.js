'use strict';
const isObject = require('is-object');
const isArray = require('is-array');
const isIteratorLike = require('is-iterator-like');
const { ITERATOR } = require('../protocols');
const assign = require('../util/assign');
// const { ObjectIterator, ArrayIterator, WrappedIterator } = require('../class/iterators');

const _INIT = val => {
  assign(iterators, require('../class/iterators'));
  return toIterator(val);
};
let iterators = { ObjectIterator: _INIT, ArrayIterator: _INIT, WrappedIterator: _INIT };

function toIterator(val) {
  if (val && typeof val[ITERATOR] === 'function') {
    return val[Symbol.iterator]();
  } else if (isObject(val)) {
    return new iterators.ObjectIterator(val);
  } else if (isArray(val)) {
    return new iterators.ArrayIterator(val);
  } else if (isIteratorLike(val)) {
    return new iterators.WrappedIterator(val);
  }

  throw new Error(`Could not figure out how to iterate ${val}`);
}

module.exports = toIterator;