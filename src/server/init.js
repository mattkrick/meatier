module.exports.run = function (thisProcess) {
  require('babel-register')({
    only: function(filename) {
      return (filename.indexOf('build') === -1 && filename.indexOf('node_modules') === -1)
    }
  })
  require('babel-polyfill')
};

