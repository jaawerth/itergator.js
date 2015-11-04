'use strict';
// const { ITERATOR } = require('../protocols');
// const assign = require('../util/assign');
const isInteger = require('is-integer');
const abs = Math.abs;
// const PROTO = require('./proto-methods');
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


module.exports = RangeIterator;