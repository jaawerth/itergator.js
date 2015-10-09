'use strict';

var toArray = Array.from || function iterToArray(iter) {
  var array = [], step;
  do {
    step = iter.next();
    array.push(step.value);
  } while(!step.done);
  return array;
};

module.exports = toArray;
