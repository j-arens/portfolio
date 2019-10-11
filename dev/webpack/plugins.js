const path = require('path');
const fs = require('fs');
const { EnvironmentPlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

function parseDotEnv(envfile) {
  if (!fs.existsSync(envfile)) {
    throw new Error(`could not find env file at ${envfile}`);
  }
  const contents = fs.readFileSync(envfile, 'utf8');
  return contents.split('\n').reduce((acc, pair) => {
    const [key, value] = pair.split('=');
    acc[key] = value;
    return acc;
  }, {});
}

module.exports = ({ mode, src, root }) => {
  const plugins = [
    new EnvironmentPlugin({
      NODE_ENV: mode,
      ...parseDotEnv(
        path.join(root, mode === 'production' ? '.env' : '.env.local'),
      ),
    }),
    new MiniCssExtractPlugin({ filename: '[name].[hash].css' }),
    new HtmlWebpackPlugin({
      inject: 'head',
      template: path.join(src, 'index.ejs'),
      excludeChunks: ['cloudflare-worker'],
    }),
    new ScriptExtHtmlWebpackPlugin({ defaultAttribute: 'defer' }),
    new CleanWebpackPlugin(),
  ];

  if (process.env.BROWSER_SYNC === 'true') {
    plugins.push(
      new BrowserSyncPlugin({
        host: 'localhost',
        port: '9501',
        proxy: 'http://localhost:9500',
      }),
    );
  }

  return { plugins };
};
