'use strict';
const toIterator = require('./to-iterator');
const { SubIterator } = require('../class');

const iteratorFork = function(n, iterable) {
  const iter = toIterator(iterable), iters = []; 
  for (let i = 0; i < n; i++) {
    iters.push(new SubIterator(iter, iters, i));
  }
  return iters.slice();
};

module.exports = iteratorFork;




