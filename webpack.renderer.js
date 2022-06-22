const webpack = require('webpack');

module.exports = {
  target: 'electron-renderer',
  optimization: {
    // Fix mysql Received packet in the wrong sequence.
    minimize: false
  },
  plugins: [
    new webpack.IgnorePlugin({resourceRegExp: /^pg-native$/})
  ]
};

