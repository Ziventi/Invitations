const rimraf = require('rimraf');

const fs = require('fs');

const { OUTPUT_DIR } = require('./config');

module.exports = {
  /**
   * Cleans the output directory.
   */
  clean: function () {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR);
    }
    rimraf(OUTPUT_DIR + '/*', module.exports.exit);
  },

  /**
   * Catch error, log to console and exit process.
   * @param {Error} err The caught error.
   */
  exit: function (err) {
    if (err) {
      console.error(err);
      process.exit(0);
    }
  },
};
