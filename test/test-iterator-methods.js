'use strict';
var test = require('tape');
var gator = require('../dist');
var samples = require('sample-objects');
var is = require('is');


function testMethods(name, object) {
  test(name + ' passes iterator methods', function(t) {

    t.test('toArray', function(t) {
      var iterator = gator(object);
      t.deepEqual(iterator.toArray(), )
    });
  });
}