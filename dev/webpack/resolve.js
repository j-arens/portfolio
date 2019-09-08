const path = require('path');
const { compilerOptions: { paths } } = require('../../tsconfig.json');

module.exports = ({ root }) => ({
  resolve: {
    extensions: ['.pcss', '.ts', '.tsx', '.js'],
    alias: Object.entries(paths).reduce((acc, [k, v]) => {
      const key = k.replace('/*', '');
      const filepath = v[0].replace('/*', '');
      const value = path.join(root, filepath);
      acc[key] = value;
      return acc;
    }, {}),
  },
});
