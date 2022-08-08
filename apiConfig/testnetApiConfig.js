const params = require('./apiParams');

module.exports = {
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
};
