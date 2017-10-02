// This is a custom Jest transformer turning style imports into empty objects.
// http://facebook.github.io/jest/docs/tutorial-webpack.html

module.exports = {
  process: () => 'module.exports = {};',
  // The output is always the same.
  getCacheKey: () => 'styleTransform'
};
