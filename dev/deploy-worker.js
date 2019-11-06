const path = require('path');
const fetch = require('node-fetch');
const { getContents } = require('./utils');

const DIST = path.resolve(__dirname, '../dist');
const EMAIL = `${process.env.CF_EMAIL}`;
const ACCOUNT_ID = `${process.env.CF_ACCOUNT_ID}`;
const ZONE_ID = `${process.env.CF_ZONE_ID}`;
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
 * @returns {Promise<void>}
 */
async function uploadScript(worker) {
  const headers = new fetch.Headers({
    'X-Auth-Email': EMAIL,
    'X-Auth-Key': API_KEY,
    'Content-Type': 'application/javascript',
  });
  const req = new fetch.Request(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts/portfolio-worker`,
    {
      method: 'PUT',
      body: worker,
      headers,
    },
  );
  const res = await fetch(req);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`failed to upload worker: ${text}`);
  }
}

/**
 * @returns {Promise<boolean>}
 */
async function checkRoute() {
  const headers = new fetch.Headers({
    'X-Auth-Email': EMAIL,
    'X-Auth-Key': API_KEY,
  });
  const req = new fetch.Request(
    `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/workers/routes`,
    {
      method: 'GET',
      headers,
    },
  );
  const res = await fetch(req);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`failed to check route: ${text}`);
  }
  const data = await res.json();
  const routes = data.result.filter(route =>
    route.pattern.startsWith('stele.tech'),
  );
  return Boolean(routes.length);
}

/**
 * @returns {Promise<void>}
 */
async function createRoute() {
  const headers = new fetch.Headers({
    'X-Auth-Email': EMAIL,
    'X-Auth-Key': API_KEY,
    'Content-Type': 'application/json',
  });
  const req = new fetch.Request(
    `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/workers/routes`,
    {
      method: 'POST',
      body: JSON.stringify({
        pattern: 'stele.tech/*',
        script: 'portfolio-worker',
      }),
      headers,
    },
  );
  const res = await fetch(req);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`failed to create route: ${text}`);
  }
}

getWorker()
  .then(async worker => {
    console.log('uploading worker...');
    await uploadScript(worker);
    console.log('checking route...');
    const routeExists = await checkRoute();
    if (routeExists) {
      console.log('route already exists, skipping creation');
    } else {
      console.log('creating route...');
      await createRoute();
    }
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
