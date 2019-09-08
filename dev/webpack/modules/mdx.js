module.exports = () => ({
  test: /\.mdx$/,
  use: [
    'babel-loader',
    '@mdx-js/loader',
  ],
});
