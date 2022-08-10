/* eslint-disable max-len */
const common = require('./commonWrapper');
const apiConfig = require('../apiConfig/mainnetApiConfig');

const wrap = {
  /**
    * Native API
    * @param {any} apiConfig - Default config of native API
    * @param {any} [customParams={}] - Custom parameters of native API
    * @param {any} [apiKey=''] - API key if available
    * @return {any}
    */
  nativeApi: async function(apiConfig, customParams={}, apiKey = '') {
    try {
      const data = await common.nativeApi(apiConfig, customParams, apiKey);
      return data;
    } catch (err) {
      throw err;
    }
  },
  api: {
    /**
     * Wrapper API (Mainnet) - Retrieve all assets of target collection
     * @param {any} wrapConfig - Custom config of wrapped API
     * @param {any} [retrieveAssetsParams={}] - Custom parameters of native API (retrieveAssets)
     * @return {any} - Assets
     */
    getAssetsByCollection: async function(wrapConfig, retrieveAssetsParams={}) {
      try {
        const data = await common.api.getAssetsByCollection(wrapConfig, apiConfig.retrieveAssets, retrieveAssetsParams);
        return data;
      } catch (err) {
        throw err;
      };
    },
    /**
     * Wrapped API (Mainnet) - Retrieve an asset of target collection by token id
     * @param {any} wrapConfig - Custom config of wrapped API
     * @param {string} tokenId - Token id of asset
     * @param {any} [retrieveAnAssetParams={}] - Optional parameters of API - retrieveAnAsset
     * @return {any}
     */
    getAssetById: async function(wrapConfig, tokenId, retrieveAnAssetParams={}) {
      try {
        const data = await common.api.getAssetById(wrapConfig, tokenId, apiConfig.retrieveAnAsset, retrieveAnAssetParams);
        return data;
      } catch (err) {
        throw err;
      };
    },
  },
  custom: {
    /**
     * Custom API (Mainnet) - Get token ids of all assets of target collection
     * @param {any} customConfig - Custom config of custom API
     * @param {any} [retrieveAssetsParams={}] - Custom parameters of native API (retrieveAssets)
     * @return {any}
     */
    getAssetIdsByCollection: async function(customConfig, retrieveAssetsParams={}) {
      try {
        const tokenIds = [];
        while (true) {
          const data = await wrap.api.getAssetsByCollection(customConfig, retrieveAssetsParams);
          if (data.assets.length > 0) {
            data.assets.forEach((asset) => tokenIds.push(asset.token_id));
          }
          if (data.next != null) {
            retrieveAssetsParams.cursor = data.next;
          } else {
            break;
          }
        };
        return tokenIds;
      } catch (err) {
        throw err;
      }
    },
    /**
     * Custom API (Mainnet) - Get owner list of all assets of target collection
     * @param {any} customConfig - Custom config of custom API
     * @param {any} [retrieveAssetsParams={}] - Custom parameters of native API (retrieveAssets)
     * @param {any} [retrieveAnAssetParams={}] - Custom parameters of native API (retrieveAnAsset)
     * @return {any}
     */
    getOwnerList: async function(customConfig, retrieveAssetsParams={}, retrieveAnAssetParams={}) {
      try {
        const data = await common.custom.getOwnerList(wrap, apiConfig, customConfig, retrieveAssetsParams, retrieveAnAssetParams);
        return data;
      } catch (err) {
        throw err;
      }
    },
    /**
     * Custom API (Mainnet) - Check if the account (address) is the owner of any asset of target collection or not
     * @param {any} customConfig - Custom config of custom API
     * @param {string} address - Account address
     * @param {any} [retrieveAssetsParams={}] - Custom parameters of native API (retrieveAssets)
     * @param {any} [retrieveAnAssetParams={}] - Custom parameters of native API (retrieveAnAsset)
     * @return {any}
     */
    checkOwnership: async function(customConfig, address, retrieveAssetsParams={}, retrieveAnAssetParams={}) {
      try {
        const data = await common.custom.checkOwnership(wrap, apiConfig, customConfig, address, retrieveAssetsParams, retrieveAnAssetParams);
        return data;
      } catch (err) {
        throw err;
      }
    },
  },
};

module.exports = wrap;
