'use strict';
// const { IteratorIterator } = require('./type-iterators');
const assign = require('../util/assign');
const PROTO = require('./proto-methods');
const { ITERATOR } = require('../protocols');
// const selfIterator = require('../methods/iterator-return-self');

function MappingIterator(iterable, mapFn, thisArg) {
  this._mapper = thisArg || thisArg === null ? mapFn.bind(thisArg) : thisArg;
  this._iter = iterable[ITERATOR]();
}

MappingIterator.prototype.next = function() {
  const nextVal = this._iter.next();
  if (nextVal.done) return { value: undefined, done: true };
  return { value: this._mapper(nextVal.value), done: false };
};

assign(MappingIterator.prototype, PROTO);

// function MapCatIterator(iterable, mapFn, thisArg) {
//   MappingIterator.call(this, iterable, mapFn, thisArg);
// }

// MapCatIterator.prototype[ITERATOR] = selfIterator;
// MapCatIterator.prototype.next = function() {
//   const nextVal = this._iter.next();
//   if (nextVal)
// }
