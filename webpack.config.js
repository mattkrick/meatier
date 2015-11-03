var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    Kanban: ['./client/client.js', 'webpack-hot-middleware/client']
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'build'),
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.json', '.jsx', '.css', '.styl']
  },
  node: { //used for joi validation on client
    dns: 'mock',
    net: 'mock'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        "stage": 0,
        "plugins": ["react-transform"],
        "extra": {
          "react-transform": {
            "transforms": [{
              "transform": "react-transform-hmr",
              "imports": ["react"],
              "locals": ["module"]
            }, {
              "transform": "react-transform-catch-errors",
              "imports": ["react", "redbox-react"]
            }]
          }
        }
      }
    }]
  }
};
