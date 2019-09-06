const path = require('path');
const EventEmitter = require('events');
const { Script } = require('vm');
const { Request, Response } = require('node-fetch');
const { getContents } = require('./utils');

const ROOT = path.resolve(__dirname, '../../');
const DIST = path.join(ROOT, 'dist');
// const MANIFEST_PATH = path.join(DIST, 'manifest.json');
const DOCUMENT_PATH = path.join(DIST, 'index.html');
const SCRIPT_PATH = path.join(DIST, 'cloudflare-worker.bundle.js');

const DOCUMENT_TAG = '<!-- % DOCUMENT % -->';
// const GLOBALS_TAG = '<!-- % GLOBALS % -->';
// const MANIFEST_TAG = '"<!-- % MANIFEST % -->"';

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
// async function prepareDocument() {
//   const document = await getContents(DOCUMENT_PATH);
//   const globals = `
//     <script type="text/javascript">
//       if (!('APP' in self)) {
//         self.APP = {};
//       }
//       self.APP.gcs = { base: '' };
//     </script>
//   `;
//   return replaceTag(GLOBALS_TAG, globals, document);
// }

/**
 * @return {Promise<string>}
 */
async function prepareScript() {
  // const manifest = await getContents(MANIFEST_PATH);
  // const document = await prepareDocument();
  const document = await getContents(DOCUMENT_PATH);
  const script = await getContents(SCRIPT_PATH);
  return replaceTag(DOCUMENT_TAG, document, script);
  // return replaceTag(MANIFEST_TAG, manifest, withDoc);;
}

/**
 * Extremely barebones mock of a cloudflare worker environment
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
    }
  };
  return ctx;
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

function waitForResponse() {
  return new Promise((res, rej) => {
    const timeout = 2000;
    let current = 0;
    const id = setInterval(() => {
      current += 1;
      console.log('CURRENT: ', current);
      if (current >= timeout) {
        rej();
        clearInterval(id);
      }
      if (response !== undefined) {
        res();
        clearInterval(id);
      }
    }, 1);
  });
}

/**
 * 
 * @param {string} url
 * @return {Promise<string>} 
 */
async function runWorker(url) {
  const script = await prepareScript();
  let context = createContext();
  const dispatch = createDispatcher(url);
  let instance = new Script(script + dispatch);
  instance.runInNewContext(context);
  console.log('HERE 1');
  await waitForResponse();
  instance = undefined;
  context = undefined;
  console.log('HERE');
  const body = await response.text();
  response = undefined;
  return body;
}

module.exports = runWorker;
