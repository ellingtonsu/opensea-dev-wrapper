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

const defaultTimer = 1000;
const productionTimer = 300;

module.exports = {
  api: {
    /**
     * Wrapper of API - Retrieve assets by specifying collection
     * @param {string} apiUrl - API endpoint
     * @param {any} config - Config
     * @param {any} [params={}] - Optional parameters of API
     * @return {any}
     */
    getAssetsByCollection: async function(apiUrl, config, params = {}) {
      const collection = config.collection;
      const apiKey = config.api_key;
      const orderDirection = params.order_direction ? params.order_direction : 'desc';
      const offset = params.offset ? params.offset : 0;
      const limit = params.limit ? params.limit : 20;
      const includeOrders = params.include_orders ? params.include_orders : false;

      const url = `${apiUrl}?collection=${collection}&order_direction=${orderDirection}&offset=${offset}&limit=${limit}&include_orders=${includeOrders}`;

      const options = {
        method: 'GET',
        headers: {'Accept': 'application/json', 'X-API-KEY': `${apiKey}`},
      };

      try {
        const res = await fetch(url, options);
        const data = await res.json();
        return data;
      } catch (err) {
        throw err;
      }
    },
    /**
     * Wrapper of API - Retrieve an asset by specifying token id
     * @param {string} apiUrl - API endpoint
     * @param {any} config - Config
     * @param {string} assetId - Token id of asset
     * @param {any} [params={}] - Optional parameters of API
     * @return {any}
     */
    getAssetById: async function(apiUrl, config, assetId, params = {}) {
      const contractAddress = config.contract_address;
      const apiKey = config.api_key;

      const url = `${apiUrl}/${contractAddress}/${assetId}`;
      const options = {
        method: 'GET',
        headers: {'Accept': 'application/json', 'X-API-KEY': `${apiKey}`},
      };

      try {
        const res = await fetch(url, options);
        const data = await res.json();
        return data;
      } catch (err) {
        throw err;
      }
    },
  },
  custom: {
    /**
     * Get owner list of all assets of specified collection
     * @param {any} utils - Wrapper
     * @param {any} config - Config
     * @param {any} [params={}] - Optional parameters of API
     * @return {any}
     */
    getOwnerList: async function(utils, config, params = {}) {
      const timer = config.api_key == '' ? defaultTimer : productionTimer;

      const response = {
        'status': 'error',
        'data': [],
        'message': '',
      };

      try {
        const data = await utils.api.getAssetsByCollection(config, params);
        const assetIds = [];
        data.assets.forEach((asset) => assetIds.push(asset.token_id));
        const numOfAssets = assetIds.length;

        await wait(timer);

        for (i=0; i<numOfAssets; i++) {
          const asset = await utils.api.getAssetById(config, assetIds[i], params);
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
     * Check if the given account address is the owner of any asset of specified collection or not
     * @param {any} utils - Wrapper
     * @param {any} config - Config
     * @param {string} address - ETH account address
     * @param {any} [params={}] - Optional parameters of API
     * @return {any}
     */
    checkOwnership: async function(utils, config, address, params = {}) {
      const timer = config.api_key == '' ? defaultTimer : productionTimer;

      const response = {
        'status': 'error',
        'owner': false,
        'address': address,
        'data': [],
        'message': '',
      };

      try {
        const data = await utils.api.getAssetsByCollection(config, params);
        const assetIds = [];
        data.assets.forEach((asset) => assetIds.push(asset.token_id));
        const numOfAssets = assetIds.length;

        await wait(timer);

        for (i=0; i<numOfAssets; i++) {
          const asset = await utils.api.getAssetById(config, assetIds[i], params);
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
