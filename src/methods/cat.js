'use strict';
const IteratorIterator = require('../class').IteratorIterator;
const toIterator = require('./to-iterator');

function concat(iterables) {
  return new IteratorIterator(toIterator(iterables));
}


module.exports = concat;


var arr = [[1,2,3].values(), [4,5,6].values(), (new Set([7,8,9])).values()].values();

var iters = concat(arr);

for (let val of iters) console.log(val);