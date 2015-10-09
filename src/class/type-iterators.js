'use strict';

'use strict';


const toIterator = require('../methods/to-iterator');

class IteratorIterator {
  constructor(iterator) {
    this._iterIterator = iterator;
    this._done = null;
    this._iter = null;
  }
  next() {
    if (this._done) return { value: undefined, done: true };

    const step = this._iter && this._iter.next();
    if (!step || step.done) {
      const iterStep = this._iterIterator.next();
      this._done = iterStep.done;
      this._iter = iterStep.value;
      return this.next();
    }
    return step;
  }
}

class ObjectIterator {
  constructor(obj) {
    this._obj = obj;
    this._keys = Object.keys(obj);
    this._step = -1;
  }
  next() {
    const key = this._keys[++this._step];
    if (this._step >= this._keys.length) return { value: undefined, done: true };
    return { value: this._obj[key], done: false };
  }
}

class ArrayIterator {
  constructor(arr) {
    this._arr = arr;
    this._i = -1;
  }
  next() {
    return { value: this._arr[++this._i], done: this._i >= this._arr.length };
  }
}
class WrappedIterator {
  constructor(iterator) {
    this._iter = iterator;
  }
  next() {
    return this._iter.next();
  }

}

const selfIterator = function() {
  return this;
};



const classes = { IteratorIterator, WrappedIterator, ObjectIterator, ArrayIterator };

Object.keys(classes).forEach(function(key) {
  classes[key].prototype[Symbol.iterator] = selfIterator;
});

module.exports = classes;