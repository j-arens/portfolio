const util = require('util');
console.log('HERE: ', util.TextDecoder);

const express = require('express');
const runWorker = require('./worker');

const app = express();

app.get('**', (req, res) => {
  console.log('REQ: ', req);
  runWorker('')
    .catch(err => {
      console.error(err);
      process.exit(1);
    })
    .then(res.send);
});

app.listen(parseInt(process.env.DS_PORT || '95', 10), server => {
  console.log('SERVER: ', server);
});
