'use strict';
const { MappingIterator } = require('./mapping-iterators');
const typed = require('./type-iterators');
const cat = require('../methods/cat');
const { ITERATOR } = require('../protocols');
const iteratorFork = require('../methods/iterator-fork');

const methods = {
  take(length) {
    return new typed.TakeIterator(length, this); 
  },
  map(mapFn) {
    return new MappingIterator(mapFn, this);
  },
  concat(...args) {
    return cat(args);
  },
  [ITERATOR]() {
    return this;
  },
  fork(n) {
    return iteratorFork(n, this);
  }
};

module.exports = methods;