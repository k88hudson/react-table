module.exports = function (config) {
  config.set({
    singleRun: false,
    browsers: ['Chrome'],
    frameworks: ['mocha'],
    reporters: ['mocha'],
    files: [
      'tests/**/*.js'
    ],
    preprocessors: {
     'tests/**/*.js': ['webpack', 'sourcemap']
    },
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [{
          test: /\.js$/,
          exclude: /(node_modules)/,
          loader: 'babel',
          query: {
            presets: ['es2015', 'react']
          }
        }]
      }
    },
    webpackMiddleware: {
      noInfo: true
    }
  });
};
