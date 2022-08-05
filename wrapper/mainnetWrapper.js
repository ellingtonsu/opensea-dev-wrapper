const common = require('./commonWrapper');

const utils = {
  api: {
    /**
     * Get Asset Ids using the API - Retrieve Assets
     * @param {any} config
     * @param {any} params={}
     * @return {any}
     */
    getAssetIdsByCollection: async function(config, params = {}) {
      const apiUrl = `https://api.opensea.io/api/v1/assets`;
      try {
        return common.api.getAssetIdsByCollection(apiUrl, config, params);
      } catch (err) {
        throw err;
      };
    },
    /**
     * Get Asset using API - Retrieve an asset
     * @param {any} config
     * @param {any} assetId
     * @param {any} params={}
     * @return {any}
     */
    getAssetById: async function(config, assetId, params = {}) {
      const apiUrl = `https://api.opensea.io/api/v1/asset`;
      try {
        return common.api.getAssetById(apiUrl, config, assetId, params);
      } catch (err) {
        throw err;
      };
    },
  },
  custom: {
    getOwnerList: async function(config, params = {}) {
      try {
        return common.custom.getOwnerList(utils, config, params);
      } catch (err) {
        throw err;
      }
    },
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
