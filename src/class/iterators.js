'use strict';
const isInteger                                       = require('is-integer');
const assign                                          = require('../util/assign');
const { ITERATOR }                                    = require('../protocols');
const toIterator                                      = require('../methods/to-iterator');
const {toArray, filter, map, reduce, cat, uniq, take} = require('../methods');


const baseProto = {
  [ITERATOR]() {
    return this;
  },
  toArray() {
    return toArray(this);
  },
  reduce(reducerFn, init) {
    return reduce(reducerFn, init, this);
  },
  filter(predicate) {
    return filter(predicate, this);
  },
  map(mapper) {
    return map(mapper, this);
  },
  concat(...args) {
    return cat([this].concat(args));
  },
  take(n) {
    return take(n, this);
  },
  uniq() {
    return uniq(this);
  },
  cat() {
    return cat(this);
  } 
};

function IteratorIterator(iterator) {
  this._iterIterator = toIterator(iterator);
  this._done = null;
  this._iter = null;
}
assign(IteratorIterator.prototype, baseProto);

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
assign(ObjectIterator.prototype, baseProto);

ObjectIterator.prototype.next = function() {
  const key = this._keys[++this._step];
  if (this._step >= this._keys.length) return { value: undefined, done: true };
  return { value: [key, this._obj[key]], done: false };
};

function ArrayIterator(arr) {
  this._arr = arr;
  this._i = -1;
}
assign(ArrayIterator.prototype, baseProto);

ArrayIterator.prototype.next = function() {
  return { value: this._arr[++this._i], done: this._i >= this._arr.length };
};

function WrappingIterator(iterator) {
  this._iter = toIterator(iterator);
}
assign(WrappingIterator.prototype, baseProto);

WrappingIterator.prototype.next = function() {
  return this._iter.next();
};



function TakeIterator(length, iterator) {
  if (!isInteger(length) || length < 0) throw new TypeError(`length must be integer >= 0, got ${length}`);
  WrappingIterator.call(this, iterator);
  this._length = length;
  this._i = 0;
}
assign(TakeIterator.prototype, WrappingIterator.prototype);

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

assign(SubIterator.prototype, baseProto);

SubIterator.prototype.next = function() {
  if (!this._queue.length) return this._queue.shift();
  const nextVal = this._base.next();
  const iters = this._iters;
  for (let i = 0; i < iters.length; i++) {
    if (i !== this._index) iters[i]._queue.push(nextVal);
  }
  return nextVal;
};

function MappingIterator(mapFn, iterable, thisArg) {
  this._mapper = (thisArg || thisArg === null) ? mapFn.bind(thisArg) : mapFn;
  this._iter = toIterator(iterable);
}

MappingIterator.prototype.next = function() {
  const nextVal = this._iter.next();
  if (nextVal.done) return nextVal;
  return { value: this._mapper(nextVal.value), done: false };
};

function FilterIterator(predicate, iterable) {
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

const abs = Math.abs;

function RangeIterator(start, end, step = 1) {
  if (!isInteger(start)) throw new Error(`Parameter 'start' must be an integer, got ${start}`);
  if (!isInteger(end)) throw new Error(`Parameter 'end' must be an integer, got ${end}`);
  this.start = start;
  this.end = end;
  this._distance = end - start;
  this._delta = 0;
  this._step = (end >= start) ? step : -step;
}

RangeIterator.prototype.next = function() {
  const d = this._delta += this.delta;
  return { done: abs(d) > abs(this._distance), value: this.start + d };
};

module.exports = {
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
