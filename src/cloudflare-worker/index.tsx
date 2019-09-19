import { h } from 'preact';
import { render } from 'preact-render-to-string';
import App from '~app/components/App';
import Blog from '~app/pages/Blog';
import About from '~app/pages/About';
import Contact from '~app/pages/Contact';
import Article from '~app/pages/Article';

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
  posts: {},
  storage: {
    url: 'http://localhost:9500',
  },
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
  // just take a copy of self.APP?
  const globals = `
    <script type="text/javascript">
      self.APP = {
        recentPosts: ${getRecentPosts()},
        posts: {},
        storage: {
          url: 'http://localhost:9500',
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
