import path from 'path';
import webpack from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';
import cssModulesValues from 'postcss-modules-values';

const root = process.cwd();
const clientInclude = [path.join(root, 'src', 'client'), path.join(root, 'src', 'universal'), /joi/, /isemail/, /hoek/, /topo/];
const globalCSS = path.join(root, 'src', 'universal', 'styles', 'global');

/* code can be: vendor-common, vendor-page-specific, meatier-common, meatier-page-specific
 * a small, fast landing page means only include the common from vendor + meatier
 * long-term caching means breaking apart meatier code from vendor code
 * The right balance in this case is to exclude material-ui from the vendor bundle
 * in order to keep the initial load small.
 * Cache vendor + app on a CDN and call it a day
 */

const vendor = [
  'react',
  'react-dom',
  // 'react-router',
  // 'react-redux',
  // 'redux',
  // 'redux-thunk',
  // 'redux-form',
  'joi'
];

const prefetches = [
  'react-dnd/lib/index.js',
  'joi/lib/index.js',
  'universal/modules/kanban/containers/Kanban/KanbanContainer.js'
];

const prefetchPlugins = prefetches.map(specifier => new webpack.PrefetchPlugin(specifier));

export default {
  context: path.join(root, 'src'),
  entry: {
    app: ['babel-polyfill', 'client/client.js'],
    vendor
  },
  output: {
    filename: '[name]_[chunkhash].js',
    chunkFilename: '[name]_[chunkhash].js',
    path: path.join(root, 'build'),
    publicPath: '/static/'
  },
  resolve: {
    extensions: ['.js', '.scss'],
    modules: [path.join(root, 'src'), 'node_modules']
  },
  node: {
    dns: 'mock',
    net: 'mock'
  },
  postcss: [cssModulesValues],
  plugins: [
    ...prefetchPlugins,
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
      minChunks: Infinity
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.MinChunkSizePlugin({minChunkSize: 50000}),
    new webpack.optimize.UglifyJsPlugin({compressor: {warnings: false}, comments: /(?:)/}),
    new AssetsPlugin({path: path.join(root, 'build'), filename: 'assets.json'}),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      '__CLIENT__': true,
      '__PRODUCTION__': true,
      'process.env.NODE_ENV': JSON.stringify('production')
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
        loader: 'fake-style!css?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]!postcss',
        include: clientInclude,
        exclude: globalCSS
      },
      {
        test: /\.css$/,
        loader: 'fake-style!css',
        include: globalCSS
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: clientInclude
      },
      {
        test: /(\.scss|\.css)$/,
        include: /(node_modules)\/react-toolbox/,
        loaders: [
          'style',
          'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'sass?sourceMap'
        ]
      }
    ]
  }
};
