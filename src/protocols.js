'use strict';

const iterator = (function() {
  var iteratorSym;
  try {
    iteratorSym = Symbol.iterator;
  } catch(e) {
    iteratorSym = '@@iterator';
  }
  return iteratorSym;
})();

module.exports = { iterator, ITERATOR: iterator };