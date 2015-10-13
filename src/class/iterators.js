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

const methods = {
  take(length) {
    return new TakeIterator(length, this); 
  },
  map(mapFn) {
    return new MappingIterator(mapFn, this);
  },
  filter(pred) {
    return new FilterIterator(pred, this);
  },
  concat(...args) {
    return cat(args.concat(this));
  },
  [ITERATOR]() {
    return this;
  },
  fork(n) {
    return iteratorFork(n, this);
  },
  toArray: Array.from ? function() { return Array.from(this); } : function() {
    const iter = toIterator(this);
    const result = [];
    for (let nextVal = iter.next(); !nextVal.done; nextVal = iter.next()) {
      result.push(nextVal.value);
    }
    return result;
  }
};

function Iterator() {

}
Iterator.prototype = methods;

inherit(MappingIterator, methods, assign({}, MappingIterator.prototype));
inherit(FilterIterator, methods, assign({}, FilterIterator.prototype));
inherit(RangeIterator, methods, assign({}, RangeIterator.prototype));


function IteratorIterator(iterator) {
  this._iterIterator = toIterator(iterator);
  this._done = null;
  this._iter = null;
}
inherit(IteratorIterator, null, methods);

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
inherit(ObjectIterator, methods);

ObjectIterator.prototype.next = function() {
  const key = this._keys[++this._step];
  if (this._step >= this._keys.length) return { value: undefined, done: true };
  return { value: [key, this._obj[key]], done: false };
};

function ArrayIterator(arr) {
  this._arr = arr;
  this._i = -1;
}
inherit(ArrayIterator, methods);

ArrayIterator.prototype.next = function() {
  return { value: this._arr[++this._i], done: this._i >= this._arr.length };
};

function WrappingIterator(iterator) {
  this._iter = toIterator(iterator);
}
inherit(WrappingIterator, methods);

WrappingIterator.prototype.next = function() {
  return this._iter.next();
};



function TakeIterator(length, iterator) {
  if (!isInteger(length) || length < 0) throw new TypeError(`length must be integer >= 0, got ${length}`);
  WrappingIterator.call(this, iterator);
  this._length = length + 1;
  this._i = 0;
}
inherit(TakeIterator, WrappingIterator, methods);

TakeIterator.prototype.next = function() {
  const nextVal = this._iter.next();
  if (nextVal.done || this._i >= this._length - 1) return { done: true, value: undefined }; 
  this._i++;
  return { value: nextVal.value, done: false }; 
};


function SubIterator(base, iters, index) {
  this._base = base;
  this._iters = iters;
  this._index = index;
  this._queue = [];
  // Object.freeze(this);
}

inherit(SubIterator, methods);

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