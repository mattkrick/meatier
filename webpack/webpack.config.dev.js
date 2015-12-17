import path from 'path';
import webpack from 'webpack';

const root = process.cwd();
const clientInclude = [path.join(root, 'src', 'client'), path.join(root, 'src', 'universal')];

const devPrefetches = [
  'react-dnd/lib/index.js',
  'react-json-tree/lib/index.js',
  'react-dock/lib/index.js',
  'lodash/object/mapValues.js',
  'joi/lib/index.js',
  './src/universal/containers/Kanban/KanbanContainer.js',
  'redux-devtools-log-monitor/lib/index.js'
]
const devPrefetchPlugins = devPrefetches.map(specifier => new webpack.PrefetchPlugin(specifier));

const babelQuery = {
  "env": {
    "development": {
      "plugins": [
        ["transform-decorators-legacy"],
        ["react-transform", {
          "transforms": [{
            "transform": "react-transform-hmr",
            "imports": ["react"],
            "locals": ["module"]
          }, {
            "transform": "react-transform-catch-errors",
            "imports": ["react", "redbox-react"]
          }]
        }]
      ]
    }
  }
}

export default {
  devtool: 'eval',
  entry: {
    app: ['babel-polyfill', './src/client/client.js', 'webpack-hot-middleware/client']
  },
  output: {
    // https://github.com/webpack/webpack/issues/1752
    filename: '[name].js',
    chunkFilename: '[name].[hash].js',
    path: path.join(root, 'build'),
    publicPath: '/static/'
  },
  plugins: [...devPrefetchPlugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      "__CLIENT__": true,
      "process.env.NODE_ENV": JSON.stringify('development')
    })
  ],
  resolve: {
    extensions: ['', '.js'],
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
        loader: 'json-loader',
        include: clientInclude
      }, {
        test: /\.txt$/,
        loader: 'raw-loader',
        include: clientInclude
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader?limit=10000',
        include: clientInclude
      }, {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader',
        include: clientInclude
      },
      {
        test: /\.css$/,
        loader: 'style!css?modules&importLoaders=1&localIdentName=[name].[local].[hash:base64:5]!postcss',
        include: clientInclude
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: clientInclude,
        query: babelQuery
      }
    ]
  }
};
