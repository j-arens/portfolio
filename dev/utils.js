const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

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
 * @param {string} envfile
 * @returns {object}
 */
function parseDotEnv(envfile) {
  if (!fs.existsSync(envfile)) {
    throw new Error(`could not find env file at ${envfile}`);
  }
  const contents = fs.readFileSync(envfile, 'utf8');
  return contents.split('\n').reduce((acc, pair) => {
    const [key, value] = pair.split('=');
    acc[key] = value;
    return acc;
  }, {});
}

module.exports = {
  parseDotEnv,
  getContents,
  writeContents,
};
