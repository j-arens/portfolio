module.exports = ({ mode }) => {
  if (mode === 'production') {
    return {
      devtool: false,
    };
  }
  return {
    devtool: 'inline-cheap-module-source-map',
  };
};
