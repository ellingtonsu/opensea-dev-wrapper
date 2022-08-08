/* eslint-disable indent */
/* eslint-disable max-len */
const fetch = require('node-fetch');
const {setTimeout} = require('core-js');

/**
 * Sleep for ms milliseconds
 * @param {any} ms
 * @return {any}
 */
function wait(ms) {
  return new Promise((resolve) =>setTimeout(() =>resolve(), ms));
};

const defaultTimer = 1200;
const productionTimer = 300;

/**
   * Description
   * @param {any} apiConfig
   * @param {any} customParams
   * @return {string}
   */
function apiUrlGenerator(apiConfig, customParams) {
  let url = apiConfig.endpoint;

  if ('pathParams' in customParams) {
    Object.keys(customParams.pathParams).forEach((key) => {
      apiConfig.pathParams[key] = customParams.pathParams[key];
    });
  }
  Object.keys(apiConfig.pathParams).forEach((key) => {
    url += `/${apiConfig.pathParams[key]}`;
  });
  url += '?';
  if ('queryParams' in customParams) {
    Object.keys(customParams.queryParams).forEach((key) => {
      apiConfig.queryParams[key] = customParams.queryParams[key];
    });
  }
  Object.keys(apiConfig.queryParams).forEach((key) => {
    url += `${key}=${apiConfig.queryParams[key]}&`;
  });
  return url;
}

const wrap = {
  /**
    * Native API
    * @param {any} apiConfig - Default config of native API
    * @param {any} customParams - Custom parameters of native API
    * @param {any} [apiKey=''] - API key if available
    * @return {any}
    */
   nativeApi: async function(apiConfig, customParams, apiKey = '') {
    try {
      const url = apiUrlGenerator(apiConfig, customParams);
      const options = {
        method: 'GET',
        headers: {'Accept': 'application/json', 'X-API-KEY': `${apiKey}`},
      };
      const res = await fetch(url, options);
      const data = await res.json();
      return data;
    } catch (err) {
      throw err;
    }
  },
  api: {
    /**
     * Wrapped API - Retrieve all assets of target collection
     * @param {any} wrapConfig - Custom config of wrapped API
     * @param {any} apiConfig - Default config of corresponding native API
     * @param {any} [retrieveAssetsParams={}] - Custom parameters of native API (retrieveAssets)
     * @return {any}
     */
    getAssetsByCollection: async function(wrapConfig, apiConfig, retrieveAssetsParams={}) {
      try {
        const apiKey = wrapConfig.api_key;
        retrieveAssetsParams.collection = wrapConfig.collection;
        const customParams = {
          pathParams: {},
          queryParams: retrieveAssetsParams,
        };
        return wrap.nativeApi(apiConfig, customParams, apiKey);
      } catch (err) {
        throw err;
      }
    },
    /**
     * Wrapped API - Retrieve an asset of target collection by token id
     * @param {any} wrapConfig - Custom config of wrapped API
     * @param {string} tokenId - Token id of asset
     * @param {any} apiConfig - Default config of corresponding native API
     * @param {any} [retrieveAnAssetParams={}] - Custom parameters of native API (retrieveAnAsset)
     * @return {any}
     */
    getAssetById: async function(wrapConfig, tokenId, apiConfig, retrieveAnAssetParams={}) {
      try {
        const apiKey = wrapConfig.api_key;
        const customParams = {
          pathParams: {
            asset_contract_address: wrapConfig.contract_address,
            token_id: tokenId,
          },
          queryParams: retrieveAnAssetParams,
        };
        return wrap.nativeApi(apiConfig, customParams, apiKey);
      } catch (err) {
        throw err;
      }
    },
  },
  custom: {
    /**
     * Custom API - Get owner list of all assets of target collection
     * @param {any} wrap - Wrapper of mainnet or testnet
     * @param {any} customConfig - Custom config of custom API
     * @param {any} [retrieveAssetsParams={}] - Custom parameters of native API (retrieveAssets)
     * @param {any} [retrieveAnAssetParams={}] - Custom parameters of native API (retrieveAnAsset)
     * @return {any}
     */
    getOwnerList: async function(wrap, customConfig, retrieveAssetsParams={}, retrieveAnAssetParams={}) {
      const timer = customConfig.api_key == '' ? defaultTimer : productionTimer;

      const response = {
        'status': 'error',
        'data': [],
        'message': '',
      };

      try {
        const data = await wrap.api.getAssetsByCollection(customConfig, retrieveAssetsParams);
        const assetIds = [];
        data.assets.forEach((asset) => assetIds.push(asset.token_id));
        const numOfAssets = assetIds.length;

        await wait(timer);

        for (i=0; i<numOfAssets; i++) {
          const asset = await wrap.api.getAssetById(customConfig, assetIds[i], retrieveAnAssetParams);
          const owners = asset.top_ownerships;
          const ownersOfAsset = {
            'name': asset.name,
            'id': asset.token_id,
            'class': asset.traits[0] ? asset.traits[0].value : 0,
            'image_url': asset.image_url,
            'owners': [],
          };

          owners.forEach((owner) => {
            const own = {};
            own.address = owner.owner.address;
            own.quantity = owner.quantity;
            ownersOfAsset.owners.push(own);
          });
          response.data.push(ownersOfAsset);
          await wait(timer);
        }
      } catch (err) {
        response.message = err.message;
        return response;
      }
      response.status = 'success';
      return response;
    },
    /**
     * Custom API - Check if the account (address) is the owner of any asset of target collection or not
     * @param {any} wrap - Wrapper of mainnet or testnet
     * @param {any} customConfig - Custom config of custom API
     * @param {string} address - Account address
     * @param {any} [retrieveAssetsParams={}] - Custom parameters of native API (retrieveAssets)
     * @param {any} [retrieveAnAssetParams={}] - Custom parameters of native API (retrieveAnAsset)
     * @return {any}
     */
    checkOwnership: async function(wrap, customConfig, address, retrieveAssetsParams={}, retrieveAnAssetParams={}) {
      const timer = customConfig.api_key == '' ? defaultTimer : productionTimer;

      const response = {
        'status': 'error',
        'owner': false,
        'address': address,
        'data': [],
        'message': '',
      };

      try {
        const data = await wrap.api.getAssetsByCollection(customConfig, retrieveAssetsParams);
        const assetIds = [];
        data.assets.forEach((asset) => assetIds.push(asset.token_id));
        const numOfAssets = assetIds.length;

        await wait(timer);

        for (i=0; i<numOfAssets; i++) {
          const asset = await wrap.api.getAssetById(customConfig, assetIds[i], retrieveAnAssetParams);
          const owners = asset.top_ownerships;

          owners.forEach((owner) => {
            if (owner.owner.address.toLowerCase() === address.toLowerCase()) {
              response.owner = true;
              const assetOfOwner = {
                'name': asset.name,
                'id': asset.token_id,
                'image_url': asset.image_url,
                'class': asset.traits[0] ? asset.traits[0].value : 0,
                'quantity': owner.quantity,
              };
              response.data.push(assetOfOwner);
            }
          });
          await wait(timer);
        }
      } catch (err) {
        response.message = err.message;
        return response;
      }

      response.status = 'success';
      return response;
    },
  },
};

module.exports = wrap;
