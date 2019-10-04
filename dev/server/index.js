const path = require('path');
const express = require('express');
const runWorker = require('./worker');

const app = express();

app.use(
  express.static(path.resolve(__dirname, '../../dist'), {
    index: false,
  }),
);

app.all('*', async (req, res) => {
  const body = await runWorker(req);
  res.send(body);
});

app.listen(9500);
