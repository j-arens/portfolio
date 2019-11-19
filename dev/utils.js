const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const readdirAsync = promisify(fs.readdir);

/**
 * @param {string} filepath
 * @returns {Promise<string>}
 */
async function getContents(filepath) {
  try {
    const contents = await readFileAsync(filepath, 'utf8');
    return contents;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

/**
 * @param {string} filepath
 * @param {string} contents
 * @returns {Promise<void>}
 */
async function writeContents(filepath, contents) {
  try {
    await writeFileAsync(filepath, contents);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

/**
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function listFiles(dir) {
  try {
    const dirents = await readdirAsync(dir, {
      withFileTypes: true,
    });
    return dirents
      .filter(dirent => !dirent.isDirectory())
      .map(dirent => dirent.name);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

// @TODO: image types
/**
 * @param {string} file
 * @returns {string}
 */
function getContentType(file) {
  const ext = path.extname(file);
  switch (ext) {
    case '.js':
      return 'text/javascript';
    case '.html':
      return 'text/html';
    case '.json':
      return 'application/json';
    case '.css':
      return 'text/css';
    default:
      return 'application/octet-stream';
  }
}

module.exports = {
  getContents,
  writeContents,
  listFiles,
  getContentType,
};
