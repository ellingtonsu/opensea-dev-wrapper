/* eslint-disable max-len */
const fetch = require('node-fetch');
const {wait, defaultTimer, productionTimer} = require('../utils/wait');

/**
   * Description
   * @param {any} apiConfig
   * @param {any} customParams
   * @return {string}
   */
function apiUrlGenerator(apiConfig, customParams) {
  const _apiConfig = JSON.parse(JSON.stringify(apiConfig));
  let url = _apiConfig.endpoint;

  if ('pathParams' in customParams) {
    Object.keys(customParams.pathParams).forEach((key) => {
      _apiConfig.pathParams[key] = customParams.pathParams[key];
    });
  }
  Object.keys(_apiConfig.pathParams).forEach((key) => {
    url += `/${_apiConfig.pathParams[key]}`;
  });
  url += '?';
  if ('queryParams' in customParams) {
    Object.keys(customParams.queryParams).forEach((key) => {
      _apiConfig.queryParams[key] = customParams.queryParams[key];
    });
  }
  Object.keys(_apiConfig.queryParams).forEach((key) => {
    url += `${key}=${_apiConfig.queryParams[key]}&`;
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
      const timer = apiKey == '' ? defaultTimer : productionTimer;
      const url = apiUrlGenerator(apiConfig, customParams);
      const options = {
        method: 'GET',
        headers: {'Accept': 'application/json', 'X-API-KEY': `${apiKey}`},
      };
      const res = await fetch(url, options);
      const data = await res.json();
      await wait(timer);
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
     * @param {any} retrieveAssetsParams - Custom parameters of native API (retrieveAssets)
     * @return {any}
     */
    getAssetsByCollection: async function(wrapConfig, apiConfig, retrieveAssetsParams) {
      try {
        const apiKey = wrapConfig.api_key;
        retrieveAssetsParams.collection = wrapConfig.collection;
        const customParams = {
          pathParams: {},
          queryParams: retrieveAssetsParams,
        };
        const data = await wrap.nativeApi(apiConfig, customParams, apiKey);
        return data;
      } catch (err) {
        throw err;
      }
    },
    /**
     * Wrapped API - Retrieve an asset of target collection by token id
     * @param {any} wrapConfig - Custom config of wrapped API
     * @param {string} tokenId - Token id of asset
     * @param {any} apiConfig - Default config of corresponding native API
     * @param {any} retrieveAnAssetParams - Custom parameters of native API (retrieveAnAsset)
     * @return {any}
     */
    getAssetById: async function(wrapConfig, tokenId, apiConfig, retrieveAnAssetParams) {
      try {
        const apiKey = wrapConfig.api_key;
        const customParams = {
          pathParams: {
            asset_contract_address: wrapConfig.contract_address,
            token_id: tokenId,
          },
          queryParams: retrieveAnAssetParams,
        };
        const data = await wrap.nativeApi(apiConfig, customParams, apiKey);
        return data;
      } catch (err) {
        throw err;
      }
    },
  },
  custom: {
    /**
     * Custom API - Get owner list of all assets of target collection
     * @param {any} wrap - Wrapper of mainnet or testnet
     * @param {any} apiConfig - apiConfig of mainnet or testnet
     * @param {any} customConfig - Custom config of custom API
     * @param {any} retrieveAssetsParams - Custom parameters of native API (retrieveAssets)
     * @param {any} retrieveAnAssetParams - Custom parameters of native API (retrieveAnAsset)
     * @return {any}
     */
    getOwnerList: async function(wrap, apiConfig, customConfig, retrieveAssetsParams, retrieveAnAssetParams) {
      const response = {
        'status': 'error',
        'data': [],
        'message': '',
      };

      try {
        const tokenIds = await wrap.custom.getAssetIdsByCollection(customConfig, retrieveAssetsParams);
        const numOfAssets = tokenIds.length;

        for (i=0; i<numOfAssets; i++) {
          const asset = await wrap.api.getAssetById(customConfig, tokenIds[i], retrieveAnAssetParams);

          const ownersOfAsset = {
            'name': asset.name,
            'id': asset.token_id,
            'class': asset.traits[0] ? asset.traits[0].value : 0,
            'image_url': asset.image_url,
            'owners': [],
          };

          const customParams = {
            pathParams: {
              asset_contract_address: customConfig.contract_address,
              token_id: tokenIds[i],
            },
            queryParams: {},
          };

          while (true) {
            const data = await wrap.nativeApi(apiConfig.retrieveOwners, customParams, customConfig.apiKey);

            data.owners.forEach((owner) => {
              const own = {};
              own.address = owner.owner.address;
              own.quantity = owner.quantity;
              ownersOfAsset.owners.push(own);
            });
            if (data.next != null) {
              customParams.queryParams.cursor = data.next;
            } else {
              break;
            }
          };
          response.data.push(ownersOfAsset);
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
     * @param {any} apiConfig - apiConfig of mainnet or testnet
     * @param {any} customConfig - Custom config of custom API
     * @param {string} address - Account address
     * @param {any} retrieveAssetsParams - Custom parameters of native API (retrieveAssets)
     * @param {any} retrieveAnAssetParams - Custom parameters of native API (retrieveAnAsset)
     * @return {any}
     */
    checkOwnership: async function(wrap, apiConfig, customConfig, address, retrieveAssetsParams, retrieveAnAssetParams) {
      const response = {
        'status': 'error',
        'owner': false,
        'address': address,
        'data': [],
        'message': '',
      };

      try {
        const tokenIds = await wrap.custom.getAssetIdsByCollection(customConfig, retrieveAssetsParams);
        const numOfAssets = tokenIds.length;

        for (i=0; i<numOfAssets; i++) {
          const asset = await wrap.api.getAssetById(customConfig, tokenIds[i], retrieveAnAssetParams);

          const customParams = {
            pathParams: {
              asset_contract_address: customConfig.contract_address,
              token_id: tokenIds[i],
            },
            queryParams: {},
          };

          while (true) {
            const data = await wrap.nativeApi(apiConfig.retrieveOwners, customParams, customConfig.apiKey);

            let isOwnerFound = false;
            data.owners.forEach((owner) => {
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
                isOwnerFound = true;
              }
            });
            if (data.next != null && isOwnerFound == false) {
              customParams.queryParams.cursor = data.next;
            } else {
              break;
            }
          };
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
