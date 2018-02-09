const _ = require('lodash');
const path = require('path');

class Utils {
  static getRootPath() {
    if (_.indexOf(process.argv, '--dev') === -1) {
      // ran without --dev flag (build version)
      // execPath = dir of program execution
      return path.dirname(process.execPath);
    } else {
      // ran with --dev flag (dev version)
      // start in src dir
      const srcDir = path.dirname(__dirname);
      // go up one to root
      return path.resolve(srcDir + '/../');
    }
  }
}

module.exports = Utils;
