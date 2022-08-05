const fetch = require('node-fetch');
const {setTimeout} = require('core-js');

/**
 * Description
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
     * Description
     * @param {any} apiUrl
     * @param {any} config
     * @param {any} params={}
     * @return {any}
     */
    getAssetIdsByCollection: async function(apiUrl, config, params = {}) {
      const collection = config.collection;
      const apiKey = config.api_key;
      const orderDirection =
            params.order_direction ? params.order_direction : 'desc';
      const offset = params.offset ? params.offset : 0;
      const limit = params.limit ? params.limit : 20;
      const includeOrders =
            params.include_orders ? params.include_orders : false;

      // eslint-disable-next-line max-len
      const url = `${apiUrl}?collection=${collection}&order_direction=${orderDirection}&offset=${offset}&limit=${limit}&include_orders=${includeOrders}`;

      const options = {
        method: 'GET',
        headers: {'Accept': 'application/json', 'X-API-KEY': `${apiKey}`},
      };

      try {
        const res = await fetch(url, options);
        const data = await res.json();
        const assetIds = [];
        data.assets.forEach((asset) => assetIds.push(asset.token_id));
        return assetIds;
      } catch (err) {
        throw err;
      }
    },
    /**
     * Get Asset using API - Retrieve an asset
     * @param {any} apiUrl
     * @param {any} config
     * @param {any} assetId
     * @param {any} params={}
     * @return {any}
     */
    getAssetById: async function(apiUrl, config, assetId, params = {}) {
      const contractAddress = config.contract_address;
      const apiKey = config.api_key;

      // eslint-disable-next-line max-len
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
    getOwnerList: async function(utils, config, params = {}) {
      const timer = config.api_key == '' ? defaultTimer : productionTimer;

      const response = {
        'status': 'error',
        'data': [],
        'message': '',
      };

      try {
        // eslint-disable-next-line max-len
        const assetIds = await utils.api.getAssetIdsByCollection(config, params);
        const numOfAssets = assetIds.length;

        await wait(timer);

        for (i=0; i<numOfAssets; i++) {
          // eslint-disable-next-line max-len
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
        // eslint-disable-next-line max-len
        const assetIds = await utils.api.getAssetIdsByCollection(config, params);
        const numOfAssets = assetIds.length;

        await wait(timer);

        for (i=0; i<numOfAssets; i++) {
          // eslint-disable-next-line max-len
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
