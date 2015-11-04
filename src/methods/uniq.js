'use strict';
const toIterator = require('./to-iterator');
const isCallable = require('is-callable');
const filter     = require('./filter');
function noSet() {
  throw new Error("No global 'Set' constructor detected. Please use es6-shim or a Set polyfill.");
}


const getPredicate = function() {
  const seen = new Set();
  return function(value) {
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  };
};

function uniq(iterable) {
  return filter(getPredicate(), toIterator(iterable));
}

module.exports = isCallable(Set) ? uniq : noSet;