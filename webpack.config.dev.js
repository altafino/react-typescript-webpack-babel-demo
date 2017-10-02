const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const FormatMessagesWebpackPlugin = require('format-messages-webpack-plugin');

const { IgnorePlugin, DefinePlugin, HotModuleReplacementPlugin, NamedModulesPlugin } = webpack;

const NODE_ENV = process.env.NODE_ENV;

const PUBLIC_PATH = '/';

const APP_TITLE = 'React TypeScript Demo';

const PROTOCOL = 'http';
const HOST = '0.0.0.0';
const PORT = 3000;

module.exports = {
  entry: {
    main: ['react-hot-loader/patch', path.join(__dirname, 'src', 'index.tsx')]
  },

  output: {
    pathinfo: true,
    publicPath: PUBLIC_PATH,
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js',
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
          name: 'media/[name].[ext]'
        }
      },
      {
        test: [/\.svg$/, /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.webp$/],
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'media/[name].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('autoprefixer')()
              ]
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
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
      }
    ]
  },

  plugins: [
    new FormatMessagesWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: path.join(__dirname, 'src', 'templates', 'index.ejs'),
      favicon: path.join(__dirname, 'src', 'favicon', 'favicon.ico'),
      title: APP_TITLE,
      inject: 'body',
      xhtml: true,
      chunksSortMode: 'dependency'
    }),
    new IgnorePlugin(/^\.\/locale$/, /moment$/),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    }),
    new HotModuleReplacementPlugin(),
    new NamedModulesPlugin()
  ],

  devServer: {
    https: PROTOCOL === 'https',
    host: HOST,
    port: PORT,
    hot: true,
    compress: true,
    open: true,
    overlay: true,
    clientLogLevel: 'none',
    quiet: true,
    historyApiFallback: true,
    publicPath: PUBLIC_PATH,
    contentBase: path.join(__dirname, 'src', 'public'),
    watchContentBase: true,
    watchOptions: { ignored: /node_modules/ }
  }
};
