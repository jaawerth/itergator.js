'use strict';
const inherit = require('../util/inherit');
const assign = require('../util/assign');
const isInteger = require('is-integer');

const { ITERATOR } = require('../protocols');
const toIterator = require('../methods/to-iterator');
const iteratorFork = require('../methods/iterator-fork');
const cat = require('../methods/cat');
const { MappingIterator, FilterIterator } = require('./mapping-iterators');
const RangeIterator = require('./range-iterator');

function Iterator() {

}

Iterator.prototype = {
  [ITERATOR]() {
    return this;
  }
};

function IteratorIterator(iterator) {
  this._iterIterator = toIterator(iterator);
  this._done = null;
  this._iter = null;
}
inherit(IteratorIterator, Iterator);

IteratorIterator.prototype.next = function() {
  if (this._done) return { value: undefined, done: true };

  const step = this._iter && this._iter.next();
  if (!step || step.done) {
    const iterStep = this._iterIterator.next();
    this._done = iterStep.done;
    this._iter = iterStep.value;
    return this.next();
  }
  return step;
};

function ObjectIterator(obj) {
  this._obj = obj;
  this._keys = Object.keys(obj);
  this._step = -1;
}
inherit(ObjectIterator, Iterator);

ObjectIterator.prototype.next = function() {
  const key = this._keys[++this._step];
  if (this._step >= this._keys.length) return { value: undefined, done: true };
  return { value: [key, this._obj[key]], done: false };
};

function ArrayIterator(arr) {
  this._arr = arr;
  this._i = -1;
}
inherit(ArrayIterator, Iterator);

ArrayIterator.prototype.next = function() {
  return { value: this._arr[++this._i], done: this._i >= this._arr.length };
};

function WrappingIterator(iterator) {
  this._iter = toIterator(iterator);
}
inherit(WrappingIterator, Iterator);

WrappingIterator.prototype.next = function() {
  return this._iter.next();
};



function TakeIterator(length, iterator) {
  if (!isInteger(length) || length < 0) throw new TypeError(`length must be integer >= 0, got ${length}`);
  WrappingIterator.call(this, iterator);
  this._length = length;
  this._i = 0;
}
inherit(TakeIterator, WrappingIterator);

TakeIterator.prototype.next = function() {
  const nextVal = this._iter.next();
  if (nextVal.done || ++this._i > this._length) return { done: true, value: undefined }; 
  return { value: nextVal.value, done: false }; 
};

function SubIterator(base, iters, index) {
  this._base = base;
  this._iters = iters;
  this._index = index;
  this._queue = [];
  // Object.freeze(this);
}

inherit(SubIterator, Iterator);

SubIterator.prototype.next = function() {
  if (!this._queue.length) return this._queue.shift();
  const nextVal = this._base.next();
  const iters = this._iters;
  for (let i = 0; i < iters.length; i++) {
    if (i !== this._index) iters[i]._queue.push(nextVal);
  }
  return nextVal;
};

module.exports = {
  Iterator,
  ArrayIterator, 
  ObjectIterator, 
  WrappingIterator, 
  IteratorIterator, 
  TakeIterator, 
  MappingIterator,
  FilterIterator,
  RangeIterator,
  SubIterator
};

// Object.keys(ctors).forEach(function(key) {
//   assign(ctors[key].prototype)
// });