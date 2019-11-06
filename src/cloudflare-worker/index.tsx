import router from './http';
import { FetchEvent } from './type';

self.addEventListener('fetch', (event: Event) => {
  const { request, respondWith } = event as FetchEvent;
  try {
    respondWith.call(event, router.dispatch(request));
  } catch (err) {
    // logging?
    console.log(err);
    respondWith.call(
      event,
      new Response('internal server error', {
        status: 500,
        statusText: 'internal server error',
      }),
    );
  }
});
