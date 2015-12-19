import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const root = process.cwd();
const serverInclude = [path.join(root, 'src', 'server'), path.join(root, 'src', 'universal')];

const prefetches = [
  'react-dnd-html5-backend/lib/index.js',
  'react-dnd/lib/index.js',
  'joi/lib/index.js',
  'redux-form/lib/index.js',
  'material-ui/lib/raised-button.js'
]
const prefetchPlugins = prefetches.map(specifier => new webpack.PrefetchPlugin(specifier));

const babelQuery = {
  "env": {
    "production": {
      "plugins": [
        ["transform-decorators-legacy"]
      ]
    }
  }
}

export default {
  context: path.join(root, "src"),
  entry: {prerender: "universal/routes/index.js"},
  target: "node",
  output: {
    path: path.join(root, 'build'),
    chunkFilename: '[name]_[chunkhash].js',
    filename: "[name].js",
    libraryTarget: "commonjs2",
    publicPath: '/static/'
  },
  // ignore anything that throws warnings
  externals: ['isomorphic-fetch','es6-promisify','socketcluster-client', 'joi', 'hoek', 'topo', 'isemail', 'moment'],
  postcss: [
    require('postcss-modules-values')
  ],
  resolve: {
    extensions: ['', '.js'],
    root: path.join(root, 'src'),
    alias: {}
  },
  plugins: [...prefetchPlugins,
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin("[name].css"),
    new webpack.optimize.UglifyJsPlugin({compressor: {warnings: false}}),
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),
    new webpack.DefinePlugin({
      "__CLIENT__": false,
      "__PRODUCTION__": true
    })
  ],
  module: {
    loaders: [
      {test: /\.json$/, loader: 'json-loader'},
      {test: /\.txt$/, loader: 'raw-loader'},
      {test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/, loader: 'url-loader?limit=10000'},
      {test: /\.(eot|ttf|wav|mp3)$/, loader: 'file-loader'},
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('fake-style', 'css?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]!postcss'),
        include: serverInclude
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: serverInclude,
        query: babelQuery
      }
    ]
  }
};
