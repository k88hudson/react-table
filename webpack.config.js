const WebpackNotifierPlugin = require('webpack-notifier');

const srcPath = './demo/demo.js';
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
      loader: 'babel',
      query: {
        presets: ['es2015', 'react']
      }
    }]
  },
  plugins: [
    new WebpackNotifierPlugin()
  ]
};
