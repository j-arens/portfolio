const path = require('path');
const EventEmitter = require('events');
const { Script } = require('vm');
const { Request, Response } = require('node-fetch');
const { getContents } = require('./utils');

const ROOT = path.resolve(__dirname, '../../');
const DIST = path.join(ROOT, 'dist');
const DOCUMENT_PATH = path.join(DIST, 'index.html');
const SCRIPT_PATH = path.join(DIST, 'cloudflare-worker.bundle.js');

const DOCUMENT_TAG = '<!-- % DOCUMENT % -->';

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
  const script = await getContents(SCRIPT_PATH);
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
 * @param {string} url
 * @return {string}
 */
function createDispatcher(url) {
  return `
    __emitter.emit('fetch', {
      request: new Request('${url}'),
      respondWith(response) {
        __setResponse(response);
      },
    });
  `;
}

/**
 *
 * @param {string} url
 * @return {Promise<string>}
 */
async function runWorker(url) {
  const script = await prepareScript();
  const context = createContext();
  const dispatch = createDispatcher(url);
  const instance = new Script(script + dispatch);
  instance.runInNewContext(context);
  const body = await response.text();
  return body;
}

module.exports = runWorker;
