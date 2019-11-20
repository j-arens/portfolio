module.exports = () => ({
  optimization: {
    splitChunks: {
      chunks({ name }) {
        return !['cloudflare-worker'].includes(name);
      },
    },
  },
});
