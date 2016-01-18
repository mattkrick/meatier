import path from 'path';
import webpack from 'webpack';
import cssModulesValues from 'postcss-modules-values';

const root = process.cwd();
const clientInclude = [path.join(root, 'src', 'client'), path.join(root, 'src', 'universal')];
const globalCSS = path.join(root, 'src', 'universal', 'styles','global');

const prefetches = [
  'react-dnd/lib/index.js',
  'react-json-tree/lib/index.js',
  'react-dock/lib/index.js',
  'lodash/object/mapValues.js',
  'joi/lib/index.js',
  'universal/modules/kanban/containers/Kanban/KanbanContainer.js',
  'redux-devtools-log-monitor/lib/index.js'
]
const prefetchPlugins = prefetches.map(specifier => new webpack.PrefetchPlugin(specifier));



const babelQuery = {
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

export default {
  //devtool: 'source-maps',
  devtool: 'eval',
  context: path.join(root, "src"),
  entry: {
    app: ['babel-polyfill', 'client/client.js', 'webpack-hot-middleware/client']
  },
  output: {
    // https://github.com/webpack/webpack/issues/1752
    filename: 'app.js',
    chunkFilename: '[name]_[chunkhash].js',
    path: path.join(root, 'build'),
    publicPath: '/static/'
  },
  plugins: [
    ...prefetchPlugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      "__CLIENT__": true,
      "__PRODUCTION__": false,
      "process.env.NODE_ENV": JSON.stringify('development'),
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
  postcss: [cssModulesValues],
  module: {
    loaders: [
      {test: /\.json$/, loader: 'json-loader'},
      {test: /\.txt$/, loader: 'raw-loader'},
      {test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/, loader: 'url-loader?limit=10000'},
      {test: /\.(eot|ttf|wav|mp3)$/, loader: 'file-loader'},
      {
        test: /\.css$/,
        loader: 'style!css',
        include: globalCSS
      },
      {
        test: /\.css$/,
        loader: 'style!css?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]!postcss',
        exclude: globalCSS,
        include: clientInclude
      },

      {
        test: /\.js$/,
        loader: 'babel',
        query: babelQuery,
        include: clientInclude
      }
    ]
  }
};
