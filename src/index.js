'use strict';
// const toIterator = require('./methods/to-iterator');
const assign = require('./util/assign');
const classes = require('./class');
//const { MappingIterator, FilterIterator, TakeIterator, RangeIterator, IterGator } =  classes;
const methods = require('./methods');
const {toIterator} = methods;

const gator = assign(toIterator.bind(null), methods);
gator.class = classes;


module.exports = gator;
