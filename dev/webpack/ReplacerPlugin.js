const { getContents, writeContents } = require('../utils');

/**
 * Basic webpack plugin that just does simple string
 * replacements to replace placeholders with generated
 * content
 */
class ReplacerPlugin {
  constructor(replacements) {
    this.replacements = replacements;
    this.doReplacements = this.doReplacements.bind(this);
  }

  /**
   * @param {webpack.compiler} compiler
   */
  apply(compiler) {
    compiler.hooks.afterEmit.tap('ReplacerPlugin', this.doReplacements);
  }

  async doReplacements() {
    for (const [tag, paths] of Object.entries(this.replacements)) {
      const subj = await getContents(paths[0]);
      const replacement = await getContents(paths[1]);
      const replaced = subj.replace(
        tag,
        // webpack's optimize minification garbles up replaced strings on prod builds
        // remove newlines/breaks and escape double quotes
        replacement.replace(/(?:\r\n|\r|\n)/gm, '').replace(/"/gm, '\\"'),
      );
      await writeContents(paths[0], replaced);
    }
  }
}

module.exports.default = ReplacerPlugin;
