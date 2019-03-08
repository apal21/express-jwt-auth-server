const fs = require('fs');

const babelrc = fs.readFileSync('.babelrc');
let config;

try {
  config = JSON.parse(babelrc);
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(err);
}

require('babel-core/register')(config);

// Load the server
require('./www');
