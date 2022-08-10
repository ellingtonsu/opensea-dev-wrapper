const params = require('./apiParams');

module.exports = {
  retrieveAContract: {
    endpoint: `https://testnets-api.opensea.io/api/v1/asset_contract`,
    pathParams: params.common.retrieveAContract.pathParams,
    queryParams: params.common.retrieveAContract.queryParams,
  },
  retrieveBundles: {
    endpoint: `https://testnets-api.opensea.io/api/v1/bundles`,
    pathParams: params.common.retrieveBundles.pathParams,
    queryParams: params.common.retrieveBundles.queryParams,
  },
  retrieveCollectionStats: {
    endpoint: `https://testnets-api.opensea.io/api/v1/collection`,
    pathParams: params.common.retrieveCollectionStats.pathParams,
    queryParams: params.common.retrieveCollectionStats.queryParams,
  },
  retrieveACollection: {
    endpoint: `https://testnets-api.opensea.io/api/v1/collection`,
    pathParams: params.common.retrieveACollection.pathParams,
    queryParams: params.common.retrieveACollection.queryParams,
  },
  retrieveCollections: {
    endpoint: `https://testnets-api.opensea.io/api/v1/collections`,
    pathParams: params.common.retrieveCollections.pathParams,
    queryParams: params.common.retrieveCollections.queryParams,
  },
  retrieveAssets: {
    endpoint: `https://testnets-api.opensea.io/api/v1/assets`,
    pathParams: params.common.retrieveAssets.pathParams,
    queryParams: params.common.retrieveAssets.queryParams,
  },
  retrieveAnAsset: {
    endpoint: `https://testnets-api.opensea.io/api/v1/asset`,
    pathParams: params.common.retrieveAnAsset.pathParams,
    queryParams: params.common.retrieveAnAsset.queryParams,
  },
  retrieveOwners: {
    endpoint: 'https://testnets-api.opensea.io/api/v1/asset',
    pathParams: params.common.retrieveOwners.pathParams,
    queryParams: params.common.retrieveOwners.queryParams,
  },
};
