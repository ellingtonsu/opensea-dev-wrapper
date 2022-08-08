const testnetWrapper = require('./testnetWrapper');
const mainnetWrapper = require('./mainnetWrapper');

module.exports = {
  testnet: testnetWrapper,
  mainnet: mainnetWrapper,
};
