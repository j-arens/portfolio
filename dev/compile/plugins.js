const path = require('path');
const { EnvironmentPlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = ({ mode, src }) => {
  const plugins = [
    new EnvironmentPlugin({
      NODE_ENV: mode
    }),
    new MiniCssExtractPlugin({
      filename: 'style/[name].[hash].css' 
    }),
    new ManifestPlugin(),
    new HtmlWebpackPlugin({
      inject: 'head',
      template: path.join(src, 'index.ejs'),
      excludeChunks: ['cloudflare-worker'],
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer',
    }),
    new CleanWebpackPlugin(),
  ];

  if (process.env.DEV_SERVER === 'true') {
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
