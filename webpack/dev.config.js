var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var Webpack_isomorphic_tools_plugin = require('webpack-isomorphic-tools/plugin');
var isoConfig = require('./isoConfig');
//var WebpackOnBuildPlugin = require('on-build-webpack');


//var webpack_isomorphic_tools_plugin = new Webpack_isomorphic_tools_plugin(isoConfig).development();
//console.log('context', path.resolve(__dirname, '..'));
module.exports = {
  devtool: 'cheap-module-eval-source-map',
  //context: path.resolve(__dirname, '..'),
  entry: {
    Kanban: ['./src/client/client.js', 'webpack-hot-middleware/client']
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'build'),
    publicPath: '/static/'
  },
  plugins: [
    new ExtractTextPlugin('style.css', {allChunks: false}),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: true  // <-------- DISABLE redux-devtools HERE
    })
    //webpack_isomorphic_tools_plugin
    //new WebpackOnBuildPlugin(function(stats) {
    //  console.log(stats);
    //})
  ],
  resolve: {
    extensions: ['', '.js', '.json', '.jsx'],
    root: './src'
  },
  node: { //used for joi validation on client
    dns: 'mock',
    net: 'mock'
  },
  postcss: [
    require('cssnext')
  ],
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[name]__[local]___[hash:base64:5]!postcss' },
      //{ test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]','postcss-loader') },
      { test: /\.svg$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml" },
      {test: /\.js$/,
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
      }
    ]
  }
};
