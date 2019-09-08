module.exports = () => ({
  optimization: {
    splitChunks: {
      chunks({ name }) {
        return !['cloudflare-worker', 'service-worker'].includes(name);
      },
    },
  },
});
