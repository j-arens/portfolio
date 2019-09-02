const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => ({
  test: /\.pcss$/,
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        plugins: () => [
          require('tailwindcss'),
          require('autoprefixer'),
        ],
      },
    },
  ],
});
