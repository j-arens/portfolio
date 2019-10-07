const path = require('path');
const EventEmitter = require('events');
const { Script } = require('vm');
const { Request, Response, Headers, fetch } = require('node-fetch');
const { getContents } = require('./utils');

const ROOT = path.resolve(__dirname, '../../');
const DIST = path.join(ROOT, 'dist');
const DOCUMENT_PATH = path.join(DIST, 'index.html');
const SCRIPT_PATH = path.join(DIST, 'cloudflare-worker.bundle.js');
const RECENT_POSTS_PATH = path.join(DIST, 'recent_posts.json');

const DOCUMENT_TAG = '<!-- % DOCUMENT % -->';
const RECENT_POSTS_TAG = '<!-- % RECENT_POSTS % -->';

let response = undefined;

/**
 * @param {string} tag
 * @param {string} replace
 * @param {string} subj
 */
function replaceTag(tag, replace, subj) {
  return subj.replace(tag, replace);
}

/**
 * @return {Promise<string>}
 */
async function prepareScript() {
  const document = await getContents(DOCUMENT_PATH);
  const recentPosts = await getContents(RECENT_POSTS_PATH);
  let script = await getContents(SCRIPT_PATH);
  script = replaceTag(RECENT_POSTS_TAG, recentPosts, script);
  return replaceTag(DOCUMENT_TAG, document, script);
}

/**
 * Extremely barebones mock of a cloudflare worker environment
 * @return {object}
 */
function createContext() {
  const ctx = {
    __setResponse(res) {
      response = res;
    },
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
    console: {
      log(...data) {
        console.log(...data);
      },
    },
  };
  return ctx;
}

/**
 *
 * @param {Express.Request} req
 * @return {string}
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
          __setResponse(response);
        },
      });
    })();
  `;
}

/**
 *
 * @param {Express.Request} req
 * @return {Promise<string>}
 */
async function runWorker(req) {
  const script = await prepareScript();
  const context = createContext();
  const dispatch = createDispatcher(req);
  const instance = new Script(script + dispatch);
  instance.runInNewContext(context);
  const res = await response;
  const body = await res.text();
  return body;
}

module.exports = runWorker;
