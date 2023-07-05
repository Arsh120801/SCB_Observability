//hash function
const crypto = require('crypto');

function hashfunc(input) {
  const hash = crypto.createHash('sha256');
  hash.update(input);
  return hash.digest('hex');
}

module.exports = hashfunc;