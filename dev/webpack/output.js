const path = require('path');

module.exports = ({ mode, root }) => {
  let publicPath = '/';
  if (mode === 'production') {
    const {
      env: { STORAGE_URL, VERSION },
    } = process;
    publicPath = `${STORAGE_URL}/${VERSION}/`;
  }
  return {
    output: {
      publicPath,
      path: path.join(root, 'dist'),
      filename: ({ chunk }) => {
        if (chunk.name === 'cloudflare-worker') {
          return '[name].bundle.js';
        }
        return '[name].[hash].js';
      },
      chunkFilename: '[name].[hash].js',
    },
  };
};
