'use strict';
// const {curry} = require('core.lambda');
const { ITERATOR } = require('../protocols');
const iterators = require('./iterators');
const toIterator = require('../methods/to-iterator');
// const mreq = name => require(`../methods/${name}`);
const assign = require('../util/assign');
// const cat = mreq('cat');
// const {TakeIterator, MappingIterator, FilterIterator, RangeIterator } = iterators;
// const methods = {
//   map(mapFn, iterable) {
//     return new MappingIterator(mapFn, iterable);
//   },
//   take(n, iterator) {
//     return new TakeIterator(n, iterator);
//   },
//   filter(pred, iterable) {
//     return new FilterIterator(pred, iterable);
//   },
//   range(start, end) {
//     return new RangeIterator(start, end);
//   },
//   scan: mreq('iterator-scan'),
//   fork: mreq('iterator-fork'),
//   cat,
//   concat() {
//     return cat.apply(null, arguments);
//   }
// };

const { TakeIterator, MappingIterator, FilterIterator } = iterators;
const cat = require('../methods/cat');
const iteratorFork = require('../methods/iterator-fork');
const methods = {
  take(length) {
    return new TakeIterator(length, toIterator(this)); 
  },
  map(mapFn) {
    return new MappingIterator(mapFn, toIterator(this));
  },
  concat(...args) {
    return cat(args.concat(toIterator(this)));
  },
  [ITERATOR]() {
    return toIterator(this);
  },
  fork(n) {
    return iteratorFork(n, toIterator(this));
  },
  toArray: Array.from ? function() { return Array.from(toIterator(this)); } : function() {
    const iter = toIterator(this);
    const result = [];
    for (let nextVal = iter.next(); !nextVal.done; nextVal = iter.next()) {
      result.push(nextVal.value);
    }
    return result;
  }
};

function IterGator(value) {
  this._wrapped = value;
}
assign(IterGator.prototype, methods);
IterGator.prototype.values = IterGator.prototype[ITERATOR];

// ['take', 'fork', 'filter', 'map'].forEach(function(key) {
//   IterGator[key] = curry(2, methods[key]);
// });

module.exports = assign({}, iterators, {IterGator});