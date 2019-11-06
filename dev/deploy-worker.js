const path = require('path');
const fetch = require('node-fetch');
const { getContents } = require('./utils');

const DIST = path.resolve(__dirname, '../dist');
const EMAIL = `${process.env.CF_EMAIL}`;
const ACCOUNT_ID = `${process.env.CF_ACCOUNT_ID}`;
const API_KEY = `${process.env.CF_KEY}`;

/**
 * @returns {Promise<string[]>}
 */
async function getWorker() {
  const contents = await getContents(
    path.join(DIST, 'cloudflare-worker.bundle.js'),
  );
  return contents;
}

/**
 * @param {string} worker
 * @returns {fetch.Request}
 */
function createRequest(worker) {
  const headers = new fetch.Headers({
    'X-Auth-Email': EMAIL,
    'X-Auth-Key': API_KEY,
    'Content-Type': 'application/javascript',
  });
  return new fetch.Request(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts/portfolio-worker`,
    {
      method: 'PUT',
      body: worker,
      headers,
    },
  );
}

getWorker()
  .then(async worker => {
    const req = createRequest(worker);
    console.log('uploading worker...');
    const res = await fetch(req);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`failed to upload worker: ${text}`);
    }
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
