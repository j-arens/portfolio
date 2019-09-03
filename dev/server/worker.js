const path = require('path');
const EventEmitter = require('events');
const { Script } = require('vm');
const { Request, Response } = require('node-fetch');
const { getContents } = require('./utils');

const ROOT = path.resolve(__dirname, '../../');
const DIST = path.join(ROOT, 'dist');
const MANIFEST_PATH = path.join(DIST, 'manifest.json');
const DOCUMENT_PATH = path.join(DIST, 'index.html');
const SCRIPT_PATH = path.join(DIST, 'cloudflare-worker.bundle.js');

const DOCUMENT_TAG = '<!-- % DOCUMENT % -->';
const GLOBALS_TAG = '<!-- % GLOBALS % -->';

let response = null;

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
async function prepareDocument() {
  const manifest = await getContents(MANIFEST_PATH);
  const document = await getContents(DOCUMENT_PATH);
  const globals = `
    <script type="text/javascript">
      window.APP = {
        manifest: ${manifest},
      };
    </script>
  `;
  return replaceTag(GLOBALS_TAG, globals, document);
}

/**
 * @return {Promise<string>}
 */
async function prepareScript() {
  const document = await prepareDocument();
  const script = await getContents(SCRIPT_PATH);
  return replaceTag(DOCUMENT_TAG, document, script);
}

/**
 * Extremely barebones mock of a cloudflare worker environment
 */
function createContext() {
  return {
    __setResponse(res) {
      response = res;
    },
    __emitter: new EventEmitter(),
    get self() {
      return this;
    },
    addEventListener(event, callback) {
      this.__emitter.on(event, callback);
    },
    Request,
    Response,
    console: {
      log(...data) {
        console.log(...data);
      },
    }
  };
}

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
