'use strict';
const isObject = require('is-object');
const isArray = require('is-array');
const isIteratorLike = require('is-iterator-like');

const { ObjectIterator, ArrayIterator, WrappedIterator } = require('../class');

function toIterator(val) {
  if (val && typeof val[Symbol.iterator] === 'function') {
    return val[Symbol.iterator]();
  } else if (isObject(val)) {
    return new ObjectIterator(val);
  } else if (isArray(val)) {
    return new ArrayIterator(val);
  } else if (isIteratorLike(val)) {
    return new WrappedIterator(val);
  }
}

module.exports = toIterator;