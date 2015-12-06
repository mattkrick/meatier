// jest/preprocessor.js
var babel = require("babel-core");
var babelJest = require('babel-jest');
var webpackAlias = require('jest-webpack-alias');
require('babel-polyfill');
module.exports = {
  process: function(src, filename) {
    if (filename.indexOf('node_modules') === -1) {
      src = babelJest.process(src, filename);
      src = webpackAlias.process(src, filename);
      return babel.transform(src, {
        filename: filename,
        stage: 0,
        retainLines: true,
        auxiliaryCommentBefore: "istanbul ignore next"
      }).code;
    }
    console.log(src)
    return src;
  }
};
