const path = require('path');
const { EnvironmentPlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReplacerPlugin = require('./ReplacerPlugin').default;
const SyntaxHighlightPlugin = require('./SyntaxHighlightPlugin').default;
const { parseDotEnv } = require('../utils');
const { version } = require('../../package.json');

module.exports = ({ mode, src, root }) => {
  const plugins = [
    new EnvironmentPlugin({
      NODE_ENV: mode,
      VERSION: version,
      PORT: process.env.BROWSER_SYNC === 'true' ? '9501' : '9500',
      ...parseDotEnv(
        path.join(root, mode === 'production' ? '.env' : '.env.local'),
      ),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
    new HtmlWebpackPlugin({
      inject: 'head',
      template: path.join(src, 'index.ejs'),
      excludeChunks: ['cloudflare-worker'],
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer',
    }),
    new ReplacerPlugin({
      '% RECENT_POSTS %': [
        path.join(root, '/dist/cloudflare-worker.bundle.js'),
        path.join(root, '/dist/recent_posts.json'),
      ],
      '% DOCUMENT %': [
        path.join(root, '/dist/cloudflare-worker.bundle.js'),
        path.join(root, '/dist/index.html'),
      ],
    }),
    new SyntaxHighlightPlugin(path.join(root, '/dist/posts')),
    // new CleanWebpackPlugin(),
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

  return {
    plugins,
  };
};
