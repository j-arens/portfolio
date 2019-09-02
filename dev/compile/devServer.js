module.exports = () => ({
  devServer: {
    port: parseInt(process.env.WDS_PORT || '96', 10),
    proxy: {
      '**': `localhost:${process.env.DS_PORT || '95'}`,
    },
  },
});
