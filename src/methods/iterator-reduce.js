'use strict';
const toIterator = require('./to-iterator');
const curry = require('core.lambda').curry;
function reduce(reducerFn, init, iterable) {
  if (typeof iterable === 'undefined') {
    iterable = init;
    init = undefined;
  }

  const iterator = toIterator(iterable);
  let step = iterator.next();
  if (!(step.done || typeof init !== 'undefined')) {
    init = step.value;
    step = iterator.next();
    init = !step.done ? reducerFn(init, step.value) : init.value;
  }
  while(!step.done) {
    init = reducerFn(init, step.value);
    step = iterator.next();
  }
}

module.exports = curry(3, reduce);