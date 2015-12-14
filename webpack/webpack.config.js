import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const root = process.cwd();

const vendor = [
  'react',
  'react-dom',
  'react-router',
  'react-redux',
  'redux',
  'redux-logger',
  'redux-thunk',
  'redux-optimist',
  'redux-form',
  'regenerate',
  'material-ui'
];

const devPrefetches = [
  'react-dnd/lib/index.js',
  'react-json-tree/lib/index.js',
  'react-dock/lib/index.js',
  'lodash/object/mapValues.js',
  'joi/lib/index.js',
  './src/universal/containers/Kanban/KanbanContainer.js',
  'redux-devtools-log-monitor/lib/index.js'
]

const devPlugins = devPrefetches.map(specifier => new webpack.PrefetchPlugin(specifier));

const prodPlugins = [
  new ExtractTextPlugin('style.css', {allChunks: true}),
  //new webpack.optimize.OccurenceOrderPlugin(),
  //new webpack.optimize.CommonsChunkPlugin('vendor','vendor.js')
]

module.exports = {
  //devtool: 'source-map',
  devtool: 'eval',
  entry: {
    app: ['babel-polyfill', './src/client/client.js', 'webpack-hot-middleware/client']
  },
  output: {
    // https://github.com/webpack/webpack/issues/1752
    filename: 'app.js',
    path: path.join(root, 'build'),
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      "__CLIENT__": true,
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ].concat(devPlugins),
  resolve: {
    extensions: ['', '.js', '.json', '.jsx'],
    alias: {},
    root: path.join(root, 'src')
  },
  // used for joi validation on client
  node: {
    dns: 'mock',
    net: 'mock'
  },
  postcss: [
    require('postcss-modules-values')
  ],
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.txt$/,
        loader: 'raw-loader'
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader?limit=10000'
      }, {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
      },
      //{ test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader') },
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: [path.join(root, 'src', 'client'), path.join(root, 'src', 'universal')],
      }
    ]
  }
};
