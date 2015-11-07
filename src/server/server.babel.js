require('babel-core/register');
var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
var path = require('path');
var rootDir = path.resolve(__dirname, '..', '..');

/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEVELOPMENT__ = true;  //process.env.NODE_ENV !== 'production';

//if (__DEVELOPMENT__) {
//  if (!require('piping')({
//      hook: true,
//      ignore: /(\/\.|~$|\.json|\.css$)/i
//    })) {
//    return;
//  }
//}
//console.log('rootDir', rootDir);
//var StatsPlugin = require('stats-webpack-plugin');
//var foo = new StatsPlugin('stats.json', {
//  chunkModules: true,
//  exclude: [/node_modules[\\\/]react/]
//});
//console.log(foo);
//global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../../webpack/isoConfig'))
require('./server');
  //.development(__DEVELOPMENT__)
  //.server(rootDir, function() {
  //  console.log('in serv');
  //  require('./server');
  //});
