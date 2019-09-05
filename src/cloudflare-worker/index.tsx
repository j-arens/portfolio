import { h } from 'preact';
import { render } from 'preact-render-to-string';
import App from  '~app/components/App';
import About from '~app/templates/About';
import Contact from '~app/templates/Contact';
import Article from '~app/templates/Article';

import { FetchEvent, Manifest } from './type';

// @ts-ignore
self.APP = {
  isSSR: true,
  components: {
    About,
    Contact,
    Article,
  },
};

const APP_TAG = '<!-- % APP % -->';
const SPLIT_CHUNK_TAG = '<!-- % SPLITCHUNKS % -->'

/**
 * 
 */
function getDocument(): string {
  return `<!-- % DOCUMENT % -->`;
}

function getManifest(): Manifest {
  // @ts-ignore
  return "<!-- % MANIFEST % -->";
}

function injectSplitChunks(document: string, url: string): string {
  const manifest = getManifest();
  const chunkKey = `${url.replace('/', '')}.js`;
  if (chunkKey in manifest) {
    const script = `<script type="text/javascript" src="${manifest[chunkKey]}" defer></script>`;
    return document.replace(SPLIT_CHUNK_TAG, script);
  }
  return document;
}

/**
 * 
 */
function renderApp(document: string, url: string): string {
  const rendered = render(<App url={url} />);
  const appDoc = document.replace(APP_TAG, rendered);
  return injectSplitChunks(appDoc, url);
}

/**
 * 
 */
function createResponse(url: string): Response {
  const doc = getDocument();
  const body = renderApp(doc, url);
  return new Response(body);
}

/**
 * 
 */
function errorResponse(): Response {
  return new Response('', {
    status: 500,
    statusText: 'internal script error',
  });
}

/**
 * 
 */
self.addEventListener('fetch', (event: Event) => {
  const { request, respondWith } = event as FetchEvent;
  try {
    respondWith(createResponse(request.url));
  } catch (err) {
    // logging?
    console.log(err);
    return respondWith(errorResponse());
  }
});
