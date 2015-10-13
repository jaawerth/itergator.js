'use strict';
const assign = Object.assign || function() {
  const target = arguments[0];
  for (let i = 1; i < arguments.length; i++) {
    let src = arguments[i];
    Object.keys(src).forEach(function(key) {
      target[key] = src[key];
    });
  }
  return target;
};


module.exports = assign;