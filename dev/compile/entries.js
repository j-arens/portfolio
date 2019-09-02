const path = require('path');

module.exports = ({ src }) => ({
  entry: {
    app: path.join(src, 'app/index.tsx'),
    about: path.join(src, 'app/templates/About.tsx'),
    contact: path.join(src, 'app/templates/Contact.tsx'),
    article: path.join(src, 'app/templates/Article.tsx'),
    'cloudflare-worker': path.join(src, 'cloudflare-worker/index.tsx'),
    'service-worker': path.join(src, 'service-worker/index.ts'),
  },
});
