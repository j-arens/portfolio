const path = require('path');
const hljs = require('highlight.js');
const { JSDOM } = require('jsdom');
const { listFiles, getContents, writeContents } = require('../utils');

/**
 * Simple plugin that does syntax highlighting on code samples embedded in post html
 */
class SyntaxHighlightPlugin {
  /**
   * @param {string} dir
   */
  constructor(dir) {
    this.dir = dir;
    this.processPosts = this.processPosts.bind(this);
  }

  /**
   * @param {webpack.compiler} compiler
   */
  apply(compiler) {
    compiler.hooks.afterEmit.tap('SyntaxHighlightPlugin', this.processPosts);
  }

  async processPosts() {
    const posts = await listFiles(this.dir);
    for (const post of posts) {
      const fullpath = path.join(this.dir, post);
      const contents = await getContents(fullpath);
      await writeContents(fullpath, this.highlightPost(contents));
    }
  }

  /**
   * @param {string} post
   */
  highlightPost(post) {
    const data = JSON.parse(post);
    const dom = new JSDOM(data.html);
    dom.window.document
      .querySelectorAll('pre code')
      .forEach(block => hljs.highlightBlock(block));
    data.html = dom.serialize();
    return JSON.stringify(data);
  }
}

module.exports.default = SyntaxHighlightPlugin;
