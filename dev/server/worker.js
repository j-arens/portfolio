const path = require('path');
const CloudWorker = require('@dollarshaveclub/cloudworker');
const { getContents, requireFresh } = require('./utils');

const ROOT = path.resolve(__dirname, '../../');
const DIST = path.join(ROOT, 'dist');
const MANIFEST_PATH = path.join(DIST, 'manifest.json');
const DOCUMENT_PATH = path.join(DIST, 'index.html');
const SCRIPT_PATH = path.join(DIST, 'cloudflare-worker.bundle.js');

const DOCUMENT_TAG = '<!-- % DOCUMENT % -->';
const GLOBALS_TAG = '<!-- % GLOBALS % -->';

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
        manifest: JSON.parse('${JSON.stringify(manifest)}'),
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
 * 
 * @param {string} url
 * @return {Promise<string>} 
 */
async function runWorker(url) {
  const script = await prepareScript();
  const req = new CloudWorker.Request(url);
  const worker = new CloudWorker(script);
  const res = await worker.dispatch(req);
  const body = await res.text();
  return body;
}

module.exports = runWorker;
