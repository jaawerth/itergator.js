'use strict';
// const isDefined = require('./is-defined');
const assign = require('./assign');
const defineObj = require('./define-object');
const methodDefs = function(methodObj, type) {
  return Object.keys(methodObj).reduce(function(methods, key) {
    if (typeof type === 'string' && typeof methodObj[key] !== type) {
      throw new TypeError(`Expecting type ${type} for key, got ${typeof value})`);
    }

    methods[key] = defineObj(methodObj[key]);
    return methods;
  }, {});
};

function inherit(Ctor, SuperCtor, methods) {
  methods = assign({}, {constructor: Ctor}, methods);
  if (typeof Ctor !== 'function') throw new TypeError(`Ctor must be a function, got ${Ctor}`);
  const superType = typeof SuperCtor;
  const proto = superType === 'function' ? SuperCtor.prototype : (SuperCtor === null || superType === 'undefined') ? {} : SuperCtor;

  Ctor.prototype = Object.create(proto, methodDefs(methods));
  return Ctor;
}

module.exports = inherit;