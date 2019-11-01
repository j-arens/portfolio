const css = require('./css');
const pcss = require('./pcss');
const ts = require('./ts');

module.exports = () => ({
  module: {
    rules: [css(), pcss(), ts()],
  },
});
