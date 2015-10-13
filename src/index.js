'use strict';
// const toIterator = require('./methods/to-iterator');
const classes = require('./class');
const { MappingIterator, FilterIterator, TakeIterator, RangeIterator, IterGator } =  classes;

const mreq = name => require(`./methods/${name}`);
// const assign = require('../util/assign');
const cat = mreq('cat');
const { curry } = require('core.lambda');
const methods = {
  map(mapFn, iterable) {
    return new MappingIterator(mapFn, iterable);
  },
  take(n, iterator) {
    return new TakeIterator(n, iterator);
  },
  filter(pred, iterable) {
    return new FilterIterator(pred, iterable);
  },
  range(start, end) {
    return new RangeIterator(start, end);
  },
  scan: mreq('iterator-scan'),
  fork: mreq('iterator-fork'),
  cat,
  concat() {
    return cat.apply(null, arguments);
  }
};

['take', 'fork', 'filter', 'map'].forEach(function(key) {
  gator[key] = curry(2, methods[key]);
});



function gator(iterable) {
  return new IterGator(iterable);
}
gator.classes = classes;

module.exports = gator;