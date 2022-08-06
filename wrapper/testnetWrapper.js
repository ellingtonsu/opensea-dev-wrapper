/* eslint-disable max-len */
const common = require('./commonWrapper');

const utils = {
  api: {
    /**
     * Wrapper of Testnet API - Retrieve assets by specifying collection
     * @param {any} config - Config
     * @param {any} params={} - Optional parameters of API
     * @return {any} - Assets
     */
    getAssetsByCollection: async function(config, params = {}) {
      const apiUrl = `https://testnets-api.opensea.io/api/v1/assets`;
      try {
        return common.api.getAssetsByCollection(apiUrl, config, params);
      } catch (err) {
        throw err;
      };
    },
    /**
     * Wrapper of Testnet API - Retrieve an asset by specifying token id
     * @param {any} config - Config
     * @param {string} assetId - Token id of asset
     * @param {any} [params={}] - Optional parameters of API
     * @return {any}
     */
    getAssetById: async function(config, assetId, params = {}) {
      const apiUrl = `https://testnets-api.opensea.io/api/v1/asset`;
      try {
        return common.api.getAssetById(apiUrl, config, assetId, params);
      } catch (err) {
        throw err;
      };
    },
  },
  custom: {
    /**
     * Testnet: get owner list of all assets of specified collection
     * @param {any} config - Config
     * @param {any} [params={}] - Optional parameters of API
     * @return {any}
     */
    getOwnerList: async function(config, params = {}) {
      try {
        return common.custom.getOwnerList(utils, config, params);
      } catch (err) {
        throw err;
      }
    },
    /**
     * Testnet: check if the given account address is the owner of any asset of specified collection or not
     * @param {any} config - Config
     * @param {string} address - ETH account address
     * @param {any} [params={}] - Optional parameters of API
     * @return {any}
     */
    checkOwnership: async function(config, address, params = {}) {
      try {
        return common.custom.checkOwnership(utils, config, address, params);
      } catch (err) {
        throw err;
      }
    },
  },
};

module.exports = {utils};
