import { h } from 'preact';
import { render } from 'preact-render-to-string';
import prepass from 'preact-ssr-prepass';
import App from  '~app/components/App';
import About from '~app/templates/About';
import Contact from '~app/templates/Contact';
import Article from '~app/templates/Article';

// import { FetchEvent, Manifest } from './type';
import { FetchEvent } from './type';

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
const GLOBALS_TAG = '<!-- % GLOBALS % -->';
// const SPLIT_CHUNK_TAG = '<!-- % SPLITCHUNKS % -->'

/**
 * 
 */
function getDocument(): string {
  return `<!-- % DOCUMENT % -->`;
}

// function getManifest(): Manifest {
//   // @ts-ignore
//   return "<!-- % MANIFEST % -->";
// }

// function injectSplitChunks(document: string, url: string): string {
//   const manifest = getManifest();
//   const chunkKey = `${url.replace('/', '')}.js`;
//   if (chunkKey in manifest) {
//     const script = `<script type="text/javascript" src="${manifest[chunkKey]}" defer></script>`;
//     return document.replace(SPLIT_CHUNK_TAG, script);
//   }
//   return document;
// }

/**
 * 
 */
async function renderApp(document: string, url: string): Promise<string> {
  try {
    const r = await prepass(<App url={url} />);
    console.log('PREPASS', r);
    const rendered = render(<App url={url} />);
    return document.replace(APP_TAG, rendered);
  } catch (err) {
    console.log('PREPASS ERR: ', err);
    return '';
  }
  // @ts-ignore
  // const rendered = render(resolved);
  // const rendered = render(<App url={url} />);
  // return document.replace(APP_TAG, rendered);
  // return injectSplitChunks(appDoc, url);
}

//       if (!('APP' in self)) {
//         self.APP = {};
//       }
//       self.APP.gcs = { base: '' };

function injectGlobals(document: string): string {
  const globals = `
    <script type="text/javascript">
      self.APP = {
        gcs: {
          base: '',
        },
        components: {},
      };
    </script>
  `;
  return document.replace(GLOBALS_TAG, globals);
}

/**
 * 
 */
async function createResponse(url: string): Promise<Response> {
  const doc = getDocument();
  console.log('CREATE RESPONSE');
  const body = await renderApp(doc, url);
  const withGlobals = injectGlobals(body);
  // return new Response(body);
  return new Response(withGlobals);
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
self.addEventListener('fetch', async (event: Event) => {
  const { request, respondWith } = event as FetchEvent;
  try {
    // console.log('CWORKER');
    const response = await createResponse(request.url);
    console.log('RESPONDING');
    respondWith(response);
    // respondWith(createResponse(request.url));
  } catch (err) {
    // logging?
    console.log(err);
    return respondWith(errorResponse());
  }
});
