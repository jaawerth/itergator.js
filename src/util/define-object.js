'use strict';
const assign = require('./assign');
module.exports = function defineObject(value, defObj) {
  if (arguments.length === 1) {
    if (value && value.hasOwnProperty && value.hasOwnProperty('value')) {
      defObj = value;
      value = undefined;
    }
  }
  return assign({}, {writable: true, configurable: true, enumerable: true }, { value }, defObj); 
}; 
