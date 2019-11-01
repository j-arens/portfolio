const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => ({
  test: /\.css$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        modules: false,
        importLoaders: 1,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        plugins: () => [require('autoprefixer')],
      },
    },
  ],
});
