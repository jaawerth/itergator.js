'use strict';
const assign = require('../util/assign');
const PROTO = require('../class/proto-methods');
const toIterator = require('./to-iterator');

module.exports = iteratorFork;
const iteratorFork = function(n, iterable) {
  const iter = toIterator(iterable), iters = []; 
  for (let i = 0; i < n; i++) {
    iters.push(new SubIterator(iter, iters, i));
  }
  return iters.slice();
};


function SubIterator(base, iters, index) {
  this._base = base;
  this._iters = iters;
  this._index = index;
  this._queue = [];
  // Object.freeze(this);
}


SubIterator.prototype.next = function() {
  if (!this._queue.length) return this._queue.shift();
  const nextVal = this._base.next();
  const iters = this._iters;
  for (let i = 0; i < iters.length; i++) {
    if (i !== this._index) iters[i]._queue.push(nextVal);
  }
  return nextVal;
};

assign(SubIterator.prototype, PROTO);

