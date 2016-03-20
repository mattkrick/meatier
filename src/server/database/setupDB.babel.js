require('babel-register');
require('babel-polyfill');
require('./setupDB.js')(process.argv[2]);

