const path = require('path');

module.exports = ({ root }) => ({
  output: {
    path: path.join(root, 'dist'),
    filename: ({ chunk }) => {
      if (chunk.name === 'cloudflare-worker') {
        return '[name].bundle.js';
      }
      return '[name].[hash].js';
    },
  },
});
