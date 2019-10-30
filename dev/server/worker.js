const path = require('path');
const EventEmitter = require('events');
const { Script } = require('vm');
const nodeurl = require('url');
const { Request, Response, Headers } = require('node-fetch');
const fetch = require('node-fetch').default;
const { getContents } = require('../utils');

const ROOT = path.resolve(__dirname, '../../');
const DIST = path.join(ROOT, 'dist');
const SCRIPT_PATH = path.join(DIST, 'cloudflare-worker.bundle.js');

/**
 * Extremely barebones mock of a cloudflare worker environment,
 * just the things needed to get it all working
 *
 * @returns {object}
 */
function createContext() {
  const ctx = {
    __response: undefined,
    __emitter: new EventEmitter(),
    get self() {
      return ctx;
    },
    addEventListener(event, callback) {
      ctx.__emitter.on(event, callback);
    },
    Request,
    Response,
    Headers,
    fetch,
    URL: class {
      constructor(url) {
        Object.entries(nodeurl.parse(url)).forEach(
          ([key, value]) => (this[key] = value),
        );
      }
    },
    // lol
    console: {
      log(...data) {
        console.log(...data);
      },
    },
  };
  return ctx;
}

/**
 * Sets up a request object and emits the 'fetch' event that is used
 * to respond to requests in a CloudFlare worker
 *
 * @param {Express.Request} req
 * @returns {string}
 */
function createDispatcher(req) {
  const url = `http://localhost${req.originalUrl}`;
  return `
    (() => {
      const url = '${url}';
      const method = '${req.method}';
      const body = '${req.body}';
      const init = { method };
      if (!['GET', 'HEAD'].includes(method)) {
        init.body = body;
      }
      const request = new Request(url, init);
      __emitter.emit('fetch', {
        request,
        respondWith(response) {
          __response = response;
        },
      });
    })();
  `;
}

/**
 * Gets the cloudflare-worker bundle and runs it in an isolated
 * vm with a special context that essentially mocks a cloudflare
 * worker environment
 *
 * @param {Express.Request} req
 * @returns {Response}
 */
async function runWorker(req) {
  const script = await getContents(SCRIPT_PATH);
  const context = createContext();
  const dispatch = createDispatcher(req);
  const instance = new Script(script + dispatch);
  instance.runInNewContext(context);
  const res = await context.__response;
  return res;
}

module.exports = runWorker;
