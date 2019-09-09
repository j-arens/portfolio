const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => ({
  test: /\.pcss$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        modules: {
          localIdentName: '[local]-[hash:base64:5]',
        },
        importLoaders: 1,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        plugins: () => [require('tailwindcss'), require('autoprefixer')],
      },
    },
  ],
});
