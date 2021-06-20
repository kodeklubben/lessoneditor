const path = require('path');

module.exports = function(app) {
  const pathToDevServer = path.join(__dirname, '../../dist/apps/backend-dev/main.js');
  require(pathToDevServer).default(app);
};
