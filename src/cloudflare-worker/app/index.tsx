import { h } from 'preact';
import { render as renderToString } from 'preact-render-to-string';
import App from '~app/components/App';
import Blog from '~app/pages/Blog';
import About from '~app/pages/About';
import Contact from '~app/pages/Contact';

const APP_TAG = '<!-- % APP % -->';
const GLOBALS_TAG = '<!-- % GLOBALS % -->';

// @ts-ignore
self.APP = {
  recentPosts: JSON.parse(`<!-- % RECENT_POSTS % -->`),
  posts: new Map(),
  storageUrl: 'http://localhost:9500',
  components: {
    Blog,
    About,
    Contact,
  },
  ssr: true,
};

function getDocument(): string {
  return `<!-- % DOCUMENT % -->`;
}

function renderApp(document: string, url: string): string {
  const rendered = renderToString(<App url={url} />);
  return document.replace(APP_TAG, rendered);
}

function injectGlobals(document: string): string {
  // just take a copy of self.APP?
  const {
    // @ts-ignore
    APP: { recentPosts },
  } = self;
  const globals = `
    <script type="text/javascript">
      self.APP = {
        recentPosts: JSON.parse('${JSON.stringify(recentPosts)}'),
        posts: new Map(),
        storageUrl: 'http://localhost:9500',
        components: {},
        ssr: false,
      };
    </script>
  `;
  return document.replace(GLOBALS_TAG, globals);
}

export function render(url: string): string {
  const doc = getDocument();
  const rendered = renderApp(doc, url);
  const withGlobals = injectGlobals(rendered);
  return withGlobals;
}
