const { promisify } = require('util');
const fs = require('fs');

const readFileAsync = promisify(fs.readFile);

async function getContents(filepath) {
  try {
    const contents = await readFileAsync(filepath, 'utf8');
    return contents;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = {
  getContents,
};
