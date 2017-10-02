const path = require('path');
const webpack = require('webpack');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BabelMinifyWebpackPlugin = require('babel-minify-webpack-plugin');
const OfflineWebpackPlugin = require('offline-plugin');
const FormatMessagesWebpackPlugin = require('format-messages-webpack-plugin');

const { IgnorePlugin, DefinePlugin } = webpack;
const { ModuleConcatenationPlugin, CommonsChunkPlugin } = webpack.optimize;

const NODE_ENV = process.env.NODE_ENV;

const PUBLIC_PATH = '/';

const APP_TITLE = 'React TypeScript Demo';

module.exports = {
  bail: true,

  devtool: 'source-map',

  stats: 'none',

  entry: {
    main: [path.join(__dirname, 'src', 'index.tsx')]
  },

  output: {
    path: path.join(__dirname, 'build'),
    publicPath: PUBLIC_PATH,
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
    devtoolModuleFilenameTemplate: (info) => path
      .relative(path.join(__dirname, 'src'), info.absoluteResourcePath)
      .replace(/\\/g, '/')
  },

  resolve: {
    extensions: ['.js', '.json', '.jsx', '.web.js', '.web.jsx', '.ts', '.tsx'],
    alias: {
      'react-native': 'react-native-web'
    }
  },

  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },

  performance: {
    hints: false
  },

  module: {
    rules: [
      {
        exclude: [
          // html-webpack-plugin
          /\.ejs$/, /\.html$/, /\.ico$/,
          // css-loader
          /\.css$/,
          // awesome-typescript-loader
          /\.json$/, /\.jsx?$/, /\.tsx?$/,
          // url-loader
          /\.svg$/, /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.webp$/
        ],
        loader: 'file-loader',
        options: {
          name: 'media/[name].[hash:8].[ext]'
        }
      },
      {
        test: [/\.svg$/, /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.webp$/],
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                minimize: true,
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [
                  require('autoprefixer')()
                ],
                sourceMap: true
              }
            }
          ]
        })
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'awesome-typescript-loader',
        options: {
          silent: true,
          transpileOnly: true,
          useBabel: true,
          useCache: true,
          cacheDirectory: path.join(__dirname, '.cache')
        }
      }
    ]
  },

  plugins: [
    new FormatMessagesWebpackPlugin(),
    new CleanWebpackPlugin(['build'], { verbose: false }),
    new CopyWebpackPlugin([{ from: path.join(__dirname, 'src', 'public') }]),
    new HTMLWebpackPlugin({
      template: path.join(__dirname, 'src', 'templates', 'index.ejs'),
      favicon: path.join(__dirname, 'src', 'favicon', 'favicon.ico'),
      title: APP_TITLE,
      inject: 'body',
      xhtml: true,
      chunksSortMode: 'dependency',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CommonsChunkPlugin({
      name: 'vendor',
      minChunks: (module) => module.context && module.context.indexOf('node_modules') !== -1
    }),
    new CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    new ModuleConcatenationPlugin(),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    }),
    new ExtractTextWebpackPlugin({
      filename: 'css/[name].[contenthash:8].css'
    }),
    new BabelMinifyWebpackPlugin(),
    new OfflineWebpackPlugin()
  ]
};
