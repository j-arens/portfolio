const path = require('path');
const { Storage } = require('@google-cloud/storage');
const { listFiles, getContentType } = require('./utils');
const { version } = require('../package.json');

const DIST = path.resolve(__dirname, '../dist');
const POSTS = path.join(DIST, '/posts');
const BUCKET = `${process.env.GC_BUCKET_NAME}` || '';
const PROJECT_ID = `${process.env.GC_PROJECT_ID}` || '';
const EMAIL = `${process.env.GC_EMAIL}` || '';
const PKEY = `${process.env.GC_PKEY}` || '';

const storage = new Storage({
  projectId: PROJECT_ID,
  credentials: {
    client_email: EMAIL, // eslint-disable-line @typescript-eslint/camelcase
    private_key: PKEY, // eslint-disable-line @typescript-eslint/camelcase
  },
});

async function push(files) {
  for (const file of files) {
    try {
      const destination = `${version}/${path.basename(file)}`;
      console.log(`pushing ${destination}...`);
      await storage.bucket(BUCKET).upload(file, {
        destination,
        public: true,
        gzip: true,
        metadata: {
          contentType: getContentType(file),
        },
      });
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}

async function listAssets() {
  const assets = await listFiles(DIST);
  return assets
    .filter(asset => asset !== 'index.html')
    .filter(asset => !asset.startsWith('cloudflare-worker'))
    .map(asset => path.join(DIST, asset));
}

async function listPosts() {
  const posts = await listFiles(POSTS);
  return posts.map(post => path.join(POSTS, post));
}

listAssets()
  .then(async assets => {
    const posts = await listPosts();
    await push([...assets, ...posts]);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
