/* eslint-disable max-len */
const common = require('./commonWrapper');
const apiConfig = require('../apiConfig/testnetApiConfig');

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
      return common.nativeApi(apiConfig, customParams, apiKey);
    } catch (err) {
      throw err;
    }
  },
  api: {
    /**
     * Wrapped API (Testnet) - Retrieve all assets of target collection
     * @param {any} wrapConfig - Custom config of wrapped API
     * @param {any} [retrieveAssetsParams={}] - Custom parameters of native API (retrieveAssets)
     * @return {any}
     */
    getAssetsByCollection: async function(wrapConfig, retrieveAssetsParams={}) {
      try {
        return common.api.getAssetsByCollection(wrapConfig, apiConfig.retrieveAssets, retrieveAssetsParams);
      } catch (err) {
        throw err;
      };
    },
    /**
     * Wrapped API (Testnet) - Retrieve an asset of target collection by token id
     * @param {any} wrapConfig - Custom config of wrapped API
     * @param {string} tokenId - Token id of asset
     * @param {any} [retrieveAnAssetParams={}] - Optional parameters of API - retrieveAnAsset
     * @return {any}
     */
    getAssetById: async function(wrapConfig, tokenId, retrieveAnAssetParams={}) {
      try {
        return common.api.getAssetById(wrapConfig, tokenId, apiConfig.retrieveAnAsset, retrieveAnAssetParams);
      } catch (err) {
        throw err;
      };
    },
  },
  custom: {
    /**
     * Custom API (Testnet) - Get owner list of all assets of target collection
     * @param {any} customConfig - Custom config of custom API
     * @param {any} [retrieveAssetsParams={}] - Custom parameters of native API (retrieveAssets)
     * @param {any} [retrieveAnAssetParams={}] - Custom parameters of native API (retrieveAnAsset)
     * @return {any}
     */
    getOwnerList: async function(customConfig, retrieveAssetsParams={}, retrieveAnAssetParams={}) {
      try {
        return common.custom.getOwnerList(wrap, customConfig, retrieveAssetsParams, retrieveAnAssetParams);
      } catch (err) {
        throw err;
      }
    },
    /**
     * Custom API (Testnet) - Check if the account (address) is the owner of any asset of target collection or not
     * @param {any} customConfig - Custom config of custom API
     * @param {string} address - Account address
     * @param {any} [retrieveAssetsParams={}] - Custom parameters of native API (retrieveAssets)
     * @param {any} [retrieveAnAssetParams={}] - Custom parameters of native API (retrieveAnAsset)
     * @return {any}
     */
    checkOwnership: async function(customConfig, address, retrieveAssetsParams={}, retrieveAnAssetParams={}) {
      try {
        return common.custom.checkOwnership(wrap, customConfig, address, retrieveAssetsParams, retrieveAnAssetParams);
      } catch (err) {
        throw err;
      }
    },
  },
};

module.exports = wrap;
