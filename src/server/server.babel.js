if (process.env.NODE_ENV !== 'production') {
  if (!require('piping')({
      hook: false,
      ignore: /(\/\.|~$|\.json$)/i
    })) {
    return;
  }
}
require('babel-core/register');
require('babel-polyfill');
require('./server');
