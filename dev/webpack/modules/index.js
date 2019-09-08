const pcss = require('./pcss');
const mdx = require('./mdx');
const ts = require('./ts');

module.exports = () => ({
  module: {
    rules: [
      pcss(),
      mdx(),
      ts(),
    ],
  },
});
