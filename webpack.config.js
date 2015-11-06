const WebpackNotifierPlugin = require('webpack-notifier');

const srcPath = './src/demo/demo.js';
const distDir = './www';
const distFilename = 'index.bundle.js'

module.exports = {
  entry: srcPath,
  output: {
    path: distDir,
    filename: distFilename,
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }]
  },
  plugins: [
    new WebpackNotifierPlugin()
  ]
};
