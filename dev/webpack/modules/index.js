const pcss = require('./pcss');
const ts = require('./ts');

module.exports = () => ({
  module: {
    rules: [pcss(), ts()],
  },
});
