const path = require('path');
const entries = require('./entries');
const devServer = require('./devServer');
const devTool = require('./devTool');
const resolve = require('./resolve');
const output = require('./output');
const modules = require('./modules');
const plugins = require('./plugins');
const optimization = require('./optimization');

const root = path.resolve(__dirname, '../../');
const src = path.join(root, 'src');
const mode = process.env.NODE_ENV || 'production';

module.exports = {
  mode,
  ...entries({ src }),
  ...devServer(),
  ...devTool({ mode }),
  ...resolve({ root }),
  ...output({ root }),
  ...modules(),
  ...plugins({ mode, src }),
  ...optimization(),
};
