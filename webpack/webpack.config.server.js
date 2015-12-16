import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import AssetsPlugin from 'assets-webpack-plugin';

const root = process.cwd();
const serverInclude = [path.join(root, 'src', 'server'), path.join(root, 'src', 'universal'), /joi/, /isemail/, /hoek/, /topo/];

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

const prefetches = [
  //'react-dnd/lib/index.js',
  //'joi/lib/index.js',
  //'./src/universal/containers/Kanban/KanbanContainer.js'
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

var commonLoaders = [
  {
    test: /\.js$|\.jsx$/,
    loaders: ['babel'],
    include: serverInclude
  },
  { test: /\.json$/, loader: "json-loader" },
  { test: /\.png$/, loader: "url-loader" },
  { test: /\.jpg$/, loader: "file-loader" },
  { test: /\.css$/,
    loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name].[local].[hash:base64:5]!postcss'),
  }
];

export default {
  name: "server-side rendering",
  context: path.join(root, "src"),
  entry: {
    app: "universal/routes/index.js"
  },
  target: "node",
  output: {
    path: path.join(root, 'serverBuild'),
    filename: "app.js",
    chunkFilename: '[name].[hash].js',
    libraryTarget: "commonjs2"
  },
  postcss: [
    require('postcss-modules-values')
  ],
  module: {
    loaders: commonLoaders
  },
  resolve: {
    extensions: ['', '.js', '.css'],
    modulesDirectories: [
      "src", "node_modules"
    ],
    alias: {}
  },
  plugins: [
    new ExtractTextPlugin("style.css"),
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
