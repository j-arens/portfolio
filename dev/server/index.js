const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const runWorker = require('./worker');

const app = express();

// sets the body property on the express request object if the
// request type is application/json, we only care about getting
// the body as a raw buffer so that we can easily pass it along to
// the node-fetch request object created in the mock cloudflare worker
app.use(
  bodyparser.raw({
    type: 'application/json',
  }),
);

// serve requests for static assets
// normally serves an index.html file for requests
// on a directory - disabled here, otherwise this middleware
// would be catching all of the requests instead of app.all
app.use(
  express.static(path.resolve(__dirname, '../../dist'), {
    index: false,
  }),
);

// matches all requests, we just want to forward the request
// on to the mock cloudflare worker and let it handle everything
// the worker returns a node-fetch response which needs to be mapped
// onto the express response object
app.all('*', async (req, expRes) => {
  const res = await runWorker(req);
  const body = await res.text();
  Object.entries(res.headers).forEach(([k, v]) => expRes.append(k, v));
  expRes.statusMessage = res.statusText;
  expRes.status(res.status);
  expRes.send(body);
});

app.listen(9500);
