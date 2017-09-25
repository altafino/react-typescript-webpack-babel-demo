const path = require('path');
const webpack = require('webpack');
const WebpackMessagesPlugin = require('webpack-messages');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BabelMinifyWebpackPlugin = require('babel-minify-webpack-plugin');
const OfflineWebpackPlugin = require('offline-plugin');

const { DefinePlugin, HotModuleReplacementPlugin, NamedModulesPlugin } = webpack;
const { ModuleConcatenationPlugin, CommonsChunkPlugin } = webpack.optimize;

// Use cross-env to set NODE_ENV from the command line
const NODE_ENV = process.env.NODE_ENV;
// Get the package name from package.json
const NAME = require('./package.json').name;

// Set this to 'https' and Webpack will generate a certificate and serve over HTTPS
const PROTOCOL = 'http';
const HOST = 'localhost';
const PORT = 8080;

// Set the path name for production builds, e.g., /react-typescript-starter
// HTMLWebpackPlugin will add a trailing slash, e.g., /react-typescript-starter/favicon.ico
// Make sure to also set this in React Router, e.g., <BrowserRouter basename='/react-typescript-starter'>
const PATH_NAME = '/';
const PUBLIC_PATH = NODE_ENV === 'production' ? PATH_NAME : '/';

// Base config (options shared by both development and production builds)
const config = {
  entry: {
    main: [path.join(__dirname, 'src', 'main', 'webapp', 'index.tsx')]
  },
  output: {
    publicPath: PUBLIC_PATH
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              // Disable logging
              silent: true,
              // Enable Babel and caching
              useBabel: true,
              useCache: true,
              cacheDirectory: path.join(__dirname, '.cache')
            }
          }
        ]
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
              // Set importLoader to 1 because of PostCSS Loader
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              // ident is required otherwise Webpack throws "Cannot read property postcss of null"
              // See https://github.com/postcss/postcss-loader/issues/287
              ident: 'postcss',
              plugins: [require('autoprefixer')()]
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        loader: 'file-loader',
        options: {
          // Outputs to whatever the path or publicPath is ('/')
          name: 'img/[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    // Displays formatted messages similar to react-dev-utils
    new WebpackMessagesPlugin({ name: NAME }),
    // Renders an ejs template to an index.html and outputs to the build folder
    // Custom properties can be accessed in the template using the htmlWebpackPlugin.options object
    new HTMLWebpackPlugin({
      template: path.join(__dirname, 'src', 'main', 'resources', 'templates', 'index.ejs'),
      // Set the title of the index page
      title: 'React TypeScript Starter',
      // Copies the favicon to the build folder and injects a link tag with the URI of the favicon
      favicon: path.join(__dirname, 'src', 'main', 'resources', 'favicon', 'favicon.ico'),
      // Inject scripts to the bottom of the body of the document
      inject: 'body',
      // Make link tags XHTML compliant (self-closing)
      xhtml: true,
      // Sort chunks by dependency graph (default behavior if using Webpack 2+)
      chunksSortMode: 'dependency'
    }),
    // Resolves all "process.env.NODE_ENV === ..." conditions in the bundle
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    }),
    // Split the bundle into "main", "vendor", and "manifest" chunks
    new CommonsChunkPlugin({
      name: 'vendor',
      minChunks: (module) => module.context && module.context.indexOf('node_modules') !== -1
    }),
    new CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    })
  ]
};

// Development settings
if (NODE_ENV === 'development') {
  // Set output file name
  // "name" will resolve to main.js, vendor.js, and manifest.js
  Object.assign(config.output, {
    filename: 'js/[name].js'
  });

  // Disable TypeScript type checking
  Object.assign(config.module.rules[0].use[0].options, {
    transpileOnly: true
  });

  // Set devServer
  Object.assign(config, {
    devServer: {
      https: PROTOCOL === 'https',
      host: HOST,
      port: PORT,
      // Enable HMR
      hot: true,
      // Gzip assets
      compress: true,
      // Open the browser
      open: true,
      // Show an in-browser overlay for errors
      overlay: true,
      // Disable watching node_modules for changes
      watchOptions: { ignored: /node_modules/ },
      // Disables [WDS] browser console messages
      // Note: [HMR] messages will still be logged
      clientLogLevel: 'none',
      // Disable shell console logging
      quiet: true,
      // 404s will load index.html - necessary for React Router
      historyApiFallback: true,
      // Ensure devServer.publicPath matches output.publicPath
      publicPath: PUBLIC_PATH,
      // Folder to serve static assets from (images, fonts, etc)
      contentBase: path.join(__dirname, 'src', 'main', 'resources', 'public')
    }
  });

  // Add React Hot Loader
  // Must always be the first entry point
  config.entry.main.unshift('react-hot-loader/patch');

  // Enable Hot Module Replacement
  config.plugins.push(
    new HotModuleReplacementPlugin(),
    // Outputs the name of the updated module(s) in the browser console
    // e.g., Updated modules: ./src/main/webapp/components/App.tsx
    new NamedModulesPlugin()
  );
}

// Production settings
if (NODE_ENV === 'production') {
  // Set output file name and append a hash for browser caching
  Object.assign(config.output, {
    filename: 'js/[name].[chunkhash:8].js'
  });

  // Set output directory
  Object.assign(config.output, {
    path: path.join(__dirname, 'build')
  });

  // Enable Webpack source maps and disable logging
  Object.assign(config, {
    devtool: 'source-map',
    stats: 'none'
  });

  // Enable Style Loader source maps
  Object.assign(config.module.rules[1].use[0], {
    options: {
      sourceMap: true
    }
  });

  // Enable CSS Loader minification and source maps
  Object.assign(config.module.rules[1].use[1].options, {
    minimize: true,
    sourceMap: true
  });

  // Enable PostCSS Loader source maps
  Object.assign(config.module.rules[1].use[2].options, {
    sourceMap: true
  });

  // Deletes the build folder before each build - must be first in the plugins array
  // Set "verbose: false" to disable logging
  // By default, the root directory is __dirname
  config.plugins.unshift(new CleanWebpackPlugin(['build'], { verbose: false }));

  config.plugins.push(
    // Wraps your bundle in a single function to speed up execution and eliminate excess code
    // See https://webpack.js.org/plugins/module-concatenation-plugin
    new ModuleConcatenationPlugin(),
    // Babel minifier
    // Slower than UglifyJS, but it supports ES6
    new BabelMinifyWebpackPlugin(),
    // Uses Service Workers to provide offline access to your app
    // Go to Application > Application > Service Workers in Chrome Dev Tools to view Service Worker status
    // Go to Application > Cache > Cache Storage to view cached assets
    new OfflineWebpackPlugin(),
    // Copies the public folder to the build folder
    new CopyWebpackPlugin([{ from: path.join(__dirname, 'src', 'main', 'resources', 'public') }])
  );
}

module.exports = config;
