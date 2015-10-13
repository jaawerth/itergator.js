'use strict';
// const { IteratorIterator } = require('./type-iterators');
// const assign = require('../util/assign');
// const PROTO = require('./proto-methods');
const toIterator = require('../methods/to-iterator');
// const selfIterator = require('../methods/iterator-return-self');

function MappingIterator(iterable, mapFn, thisArg) {
  this._mapper = thisArg || thisArg === null ? mapFn.bind(thisArg) : thisArg;
  this._iter = toIterator(iterable);
}

MappingIterator.prototype.next = function() {
  const nextVal = this._iter.next();
  if (nextVal.done) return nextVal;
  return { value: this._mapper(nextVal.value), done: false };
};

function FilterIterator(iterable, predicate, thisArg) {
  this._predicate = predicate;
  this._iter = toIterator(iterable);
}

FilterIterator.prototype.next = function() {
  let nextVal = this._iter.next(); 
  while(!nextVal.done && !this._predicate(nextVal.value)) {
    nextVal = this._iter.next();  
  }
  return nextVal;
};
// assign(MappingIterator.prototype, PROTO);

module.exports = { MappingIterator, FilterIterator };
// function MapCatIterator(iterable, mapFn, thisArg) {
//   MappingIterator.call(this, iterable, mapFn, thisArg);
// }

// MapCatIterator.prototype[ITERATOR] = selfIterator;
// MapCatIterator.prototype.next = function() {
//   const nextVal = this._iter.next();
//   if (nextVal)
// }
