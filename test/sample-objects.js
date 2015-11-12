'use strict';
var customObject = {};
customObject[Symbol.iterator] = function() {
  return ['foo', 'bar', 'baz'];
};

var samples = {
  emptyArray: [],
  array: ['foo', 'bar', 'baz'],
  object: {foo: 1, bar: 2, baz: 3},
  emptyObject: {},
  map: new Map([['foo', 1], ['bar', 2], ['baz', 3]]),
  set: new Set(['foo', 'bar', 'baz']),
  customObject: customObject
};

module.exports = samples;
