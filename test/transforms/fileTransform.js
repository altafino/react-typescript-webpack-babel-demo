// This is a custom Jest transformer turning file imports into filenames.
// http://facebook.github.io/jest/docs/tutorial-webpack.html

const path = require('path');

module.exports = {
  process (src: any, filename: string, config: any, options: any): string {
    return `module.exports = ${JSON.stringify(path.basename(filename))};`;
  }
};
