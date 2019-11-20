const path = require('path');

module.exports = ({ src }) => ({
  entry: {
    app: path.join(src, 'app/index.tsx'),
    'cloudflare-worker': path.join(src, 'cloudflare-worker/index.tsx'),
  },
});
