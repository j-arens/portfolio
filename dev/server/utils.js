const { promisify } = require('util');
const fs = require('fs');

const readFileAsync = promisify(fs.readFile);

async function getContents(filepath) {
  try {
    const contents = await readFileAsync(filepath);
    return contents;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

// function requireFresh(mod) {
//   delete require.cache[require.resolve(mod)];
//   return require(mod);
// }

module.exports = {
  getContents,
  // requireFresh,
};
