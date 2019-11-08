const path = require('path');
const entries = require('./entries');
const devTool = require('./devTool');
const resolve = require('./resolve');
const output = require('./output');
const modules = require('./modules');
const plugins = require('./plugins');
const optimization = require('./optimization');
const { parseDotEnv } = require('../utils');
const { version } = require('../../package.json');

const root = path.resolve(__dirname, '../../');
const src = path.join(root, 'src');
const mode = process.env.NODE_ENV || 'production';

process.env = {
  ...process.env,
  ...parseDotEnv(
    path.join(root, mode === 'production' ? '.env' : '.env.local'),
  ),
  VERSION: version,
};

const config = {
  mode,
  ...entries({
    src,
  }),
  ...devTool({
    mode,
  }),
  ...resolve({
    root,
  }),
  ...output({
    mode,
    root,
  }),
  ...modules(),
  ...plugins({
    mode,
    src,
    root,
  }),
  ...optimization(),
};

module.exports = config;
