import { h } from 'preact';
import { render } from 'preact-render-to-string';
import App from '~app/components/App';
import Blog from '~app/templates/Blog';
import About from '~app/templates/About';
import Contact from '~app/templates/Contact';
import Article from '~app/templates/Article';

// import { FetchEvent, RecentPosts } from './type';
import { FetchEvent } from './type';

const APP_TAG = '<!-- % APP % -->';
const GLOBALS_TAG = '<!-- % GLOBALS % -->';

/**
 *
 */
function getDocument(): string {
  return `<!-- % DOCUMENT % -->`;
}

function getRecentPosts(): string {
  return `<!-- % RECENT_POSTS % -->`;
}

// @ts-ignore
self.APP = {
  recentPosts: JSON.parse(getRecentPosts()),
  components: {
    Blog,
    About,
    Contact,
    Article,
  },
};

/**
 *
 */
function renderApp(document: string, url: string): string {
  const rendered = render(<App url={url} />);
  return document.replace(APP_TAG, rendered);
}

function injectGlobals(document: string): string {
  const globals = `
    <script type="text/javascript">
      self.APP = {
        recentPosts: ${getRecentPosts()},
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
function createResponse(url: string): Response {
  const doc = getDocument();
  const body = renderApp(doc, url);
  const withGlobals = injectGlobals(body);
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
