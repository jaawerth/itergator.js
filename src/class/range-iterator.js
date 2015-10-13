'use strict';
const { ITERATOR } = require('../protocols');
const assign = require('../util/assign');
const selfIterator = require('../methods/iterator-return-self');
const isInteger = require('is-integer');
const PROTO = require('./proto-methods');
function RangeIterator(start, end) {
  if (!isInteger(start)) throw new Error(`Parameter 'start' must be an integer, got ${start}`);
  if (typeof end === 'undefined') {
    end = (start >= 0) ? start - 1 : start + 1;
    start = 0;
  }
  this.start = start;
  this.end = end;
  this._distance = end - start;
  this._delta = (end >= start) ? 1 : -1;
}

RangeIterator.prototype.next = function() {
  const i = this.i += this.delta;
  if (i > this._distance) return { value: undefined, done: true };
  return { done: false, value: this.start + i };
};

assign(RangeIterator.prototype, PROTO);

module.exports = RangeIterator;