require('babel-register');
require('babel-polyfill')
var pretest = require('./pretest.js');
console.log(pretest);
console.log(pretest.default);
pretest.default();
