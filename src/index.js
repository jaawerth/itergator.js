'use strict';
// const toIterator = require('./methods/to-iterator');
const classes = require('./class');
//const { MappingIterator, FilterIterator, TakeIterator, RangeIterator, IterGator } =  classes;
const methods = require('./methods');
const {toIterator} = methods;


function gator(value) {
  return toIterator(value);
}
Object.assign(gator, methods);


module.exports = gator;
