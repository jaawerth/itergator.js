'use strict';
const PROTO = require('./proto-methods');
const assign = require('../util/assign');
// const { ITERATOR } = require('../protocols');
// const selfIterator = require('../methods/iterator-return-self');
const toIterator = require('../methods/to-iterator');
const isInteger = require('is-integer');

function IteratorIterator(iterator) {
  this._iterIterator = iterator;
  this._done = null;
  this._iter = null;
}
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
ObjectIterator.prototype.next = function() {
  const key = this._keys[++this._step];
  if (this._step >= this._keys.length) return { value: undefined, done: true };
  return { value: this._obj[key], done: false };
};

function ArrayIterator(arr) {
  this._arr = arr;
  this._i = -1;
}
ArrayIterator.prototype.next = function() {
  return { value: this._arr[++this._i], done: this._i >= this._arr.length };
};

function WrappingIterator(iterator) {
  this._iter = iterator;
}

WrappingIterator.prototype.next = function() {
  return this._iter.next();
};



function TakeIterator(length, iterator) {
  if (!isInteger(length) || length < 0) throw new TypeError(`length must be integer >= 0, got ${length}`);
  WrappingIterator.call(this, iterator);
  this._length = length;
  this._i = 0;
}

TakeIterator.prototype = Object.create(WrappingIterator.prototype, {
  constructor: { value: TakeIterator, configurable: true }
});

TakeIterator.prototype.next = function() {
  const nextVal = this._iter.next();
  if (nextVal.done || this._i >= this._length - 1) return { done: true, value: undefined }; 
  this._i++;
  return { value: nextVal.value, done: false }; 
};

const classes = { IteratorIterator, WrappingIterator, ObjectIterator, ArrayIterator };

Object.keys(classes).forEach(function(key) {
  assign(classes[key].prototype, PROTO);
});

console.log(classes);
module.exports = classes;