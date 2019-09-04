import { h } from 'preact';
import { render } from 'preact-render-to-string';
import App from  '~app/components/App';
import About from '~app/templates/About';
import Contact from '~app/templates/Contact';
import Article from '~app/templates/Article';

import { FetchEvent } from './type';

// @ts-ignore
self.APP = {
  components: {
    About,
    Contact,
    Article,
  },
};

const APP_TAG = '<!-- % APP % -->';

/**
 * 
 */
function getDocument(): string {
  return `<!-- % DOCUMENT % -->`;
}

/**
 * 
 */
function renderApp(document: string, url: string): string {
  const rendered = render(<App url={url} />);
  return document.replace(APP_TAG, rendered);
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
