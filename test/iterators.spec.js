const test = require('tape');

const gator = require('./dist');
test('Array iterators', function(t) {
  const array = [1,2,3,4,5];
  const empty = [];

  t.ok(gator(empty).next().done, "Empty array's first value is done.");
  t.deepEqual(gator.toArray(gator(array)), array, "toArray(toIterator(array)) deepEquals array");

});