const testnet = require('./testnetWrapper');
const mainnet = require('./mainnetWrapper');

module.exports = {
  testnet: testnet.utils,
  mainnet: mainnet.utils,
};
