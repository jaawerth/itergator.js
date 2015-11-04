'use strict';
const curry = require('core.lambda').curry;

const {TakeIterator, MappingIterator, RangeIterator} = require('../class');
const toIterator = require('./to-iterator');
const fork = require('./iterator-fork');
const cat = require('./cat');
const filter = require('./filter');
const reduce = require('./iterator-reduce');
const methods = {
  cat,
  filter,
  toIterator,
  uniq: require('./uniq'),
  reduce: curry(3, reduce),
  concat(...args) {
    return cat(args);
  },
  fork,

  take: curry(2, take),
  map: curry(2, map),
  range: curry(2, range)

};

module.exports = methods;

function take(length, iterator) {
  return new TakeIterator(length, iterator); 
}

function map(mapFn, iterator) {
  return new MappingIterator(mapFn, iterator);
}

function range(start, end, step) {
  return new RangeIterator(start, end, step);
}