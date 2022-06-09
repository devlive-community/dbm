module.exports = (config, options) => {
  config.target = 'electron-renderer';
  // Fix mysql Received packet in the wrong sequence.
  config.optimization.minimize = false;
  return config;
};
