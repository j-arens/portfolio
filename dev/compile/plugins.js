const path = require('path');
const { EnvironmentPlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
// const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
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
      template: path.join(src, 'index.ejs'),
      excludeChunks: [
        'about',
        'contact',
        'article',
        // 'service-worker',
        'cloudflare-worker',
      ],
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer',
    }),
    new CleanWebpackPlugin(),
  ];

  // if (process.env.DEV_SERVER === 'true') {
  //   plugins.push(
  //     new BrowserSyncPlugin({
  //       host: 'localhost',
  //       port: '5432',
  //       server: {
  //         baseDir: path.resolve(__dirname, '../dist'),
  //       },
  //     }),
  //   );
  // }
  
  // return plugins;
  return { plugins };
};
