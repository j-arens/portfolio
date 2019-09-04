const path = require('path');
const express = require('express');
const runWorker = require('./worker');

const app = express();

app.get('*', (req, res, next) => {
  if (req.url.endsWith('.js')) {
    console.log('ASSET REQ: ', req.url);
    return next();
  }
  runWorker(req.url)
    .catch(err => {
      console.error(err);
      process.exit(1);
    })
    .then(body => res.send(body));
});

app.use(express.static(path.resolve(__dirname, '../../dist')));

app.listen(9500);
