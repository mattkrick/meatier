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
    },
    "development": {
      "plugins": [
        ["transform-decorators-legacy"]
      ]
    }
  }
}

export default {
  context: path.join(root, "src"),
  entry: {
    prerender: "universal/routes/index.js"
  },
  target: "node",
  output: {
    path: path.join(root, 'build'),
    chunkFilename: '[name].[hash].js',
    filename: "[name].js",
    libraryTarget: "commonjs2",
    publicPath: '/static/'
  },
  // ignore anything that throws warnings
  externals: ['isomorphic-fetch','es6-promisify','socketcluster-client', 'joi', 'hoek', 'topo', 'isemail', 'moment'],
  postcss: [
    require('postcss-modules-values')
  ],
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader',
        include: serverInclude
      }, {
        test: /\.txt$/,
        loader: 'raw-loader',
        include: serverInclude
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader?limit=10000',
        include: serverInclude
      }, {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader',
        include: serverInclude
      },
      {
        test: /\.css$/,
        //loader: 'css?modules&importLoaders=1&localIdentName=[name].[local].[hash:base64:5]!postcss',
        loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name].[local].[hash:base64:5]!postcss'),
        include: serverInclude,
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: serverInclude,
        query: babelQuery
      }
    ]
  },
  resolve: {
    extensions: ['', '.js'],
    root: path.join(root, 'src'),
    alias: {}
  },
  plugins: [...prefetchPlugins,
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin("[name].css"),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      "__CLIENT__": false,
      "process.env.NODE_ENV": JSON.stringify('production')
    }),
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1})
  ]
};
