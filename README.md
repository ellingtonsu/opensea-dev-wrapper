# opensea-dev-wrapper<!-- omit in toc -->
A JavaScript software development kit (SDK) for easily interacting with native OpenSea SDK, APIs, or contracts.

## Table of Content<!-- omit in toc -->

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Native API](#native-api)
  - [A Complete Example of Native API](#a-complete-example-of-native-api)
  - [Built-in Native API Configs](#built-in-native-api-configs)
- [Wrapped APIs](#wrapped-apis)
  - [A Complete Example of Wrapped APIs](#a-complete-example-of-wrapped-apis)
  - [Built-in Wrapped APIs](#built-in-wrapped-apis)
- [Custom APIs](#custom-apis)
  - [A Complete Example of Custom APIs](#a-complete-example-of-custom-apis)
  - [Bulit-in Custom APIs](#bulit-in-custom-apis)
- [Release Notes](#release-notes)
  - [v1.1.1](#v111)
  - [v1.1.0](#v110)
  - [v1.0.1](#v101)

## Installation
In your project, run
```shell
npm i opensea-dev-wrapper --save
```

## Getting Started
First, developers use ```require()``` to include ```opensea-dev-wrapper``` as

```js
const {openseaWrap, apiConfig} = require('opensea-dev-wrapper');
```

Developers can interace with OpenSea with ```openseaWrap``` object and can retieve the built-in default configs of OpenSea native APIs with ```apiConfig``` object.

Then, developers can use ```opensea-dev-wrapper``` in different ways as described as follows.

## Native API
Developers can call any native [OpenSean API](https://docs.opensea.io/reference/api-overview) with ```nativeApi``` function deifined as

```js
/**
  * Native API
  * @param {any} apiConfig - Default config of native API
  * @param {any} [customParams={}] - Custom parameters of native API
  * @param {any} [apiKey=''] - API key if available
  * @return {any}
  */
  nativeApi(apiConfig, customParams={}, apiKey='');
```

Developers can retrieve the default configs of **some** OpenSea APIs built-in in ```opensea-dev-wrapper``` with ```apiConfig``` object as

```js
const testnetTargetApiConfig = apiConfig.testnet.[built-in APIs]; // apiConfig.mainnet for mainnet
```

 If target API is not built-in in ```opensea-dev-wrapper```, experienced developers can create the config of target API. For example, the config of testnet API (retrieve assets) can be defined as  

```js
const testnetRetrieveAssetsConfig =  {
  endpoint: `https://testnets-api.opensea.io/api/v1/assets`,
  pathParams: {},
  queryParams: {
    order_direction: 'desc',
    limit: 20,
    include_orders: false,
  },
},  
```

If the custom path and query parameters are expected, developers can define the ```customParams``` object. For example, 

```js
const customParams = {
  pathParams: {},
  queryParams: {
    limit: 5,
  },
};
```

### A Complete Example of Native API
```js
const {openseaWrap, apiConfig} = require('opensea-dev-wrapper');
const testnetRetrieveAssetsConfig = apiConfig.testnet.retrieveAssets;

const customParams = {
  pathParams: {},
  queryParams: {
    collection: 'dtg-wounderland',
    limit: 5,
  },
};

async function test() {
  const data = await openseaWrap.testnet.nativeApi(testnetRetrieveAssetsConfig, customParams);
  console.log(data);
}

test();
```

### Built-in Native API Configs
- Retrieve assets ([mainnet](https://docs.opensea.io/reference/getting-assets), [testnet](https://docs.opensea.io/reference/retrieving-assets-rinkeby))
- Retrieve an asset ([mainnet](https://docs.opensea.io/reference/retrieving-a-single-asset), [testnet](https://docs.opensea.io/reference/retrieving-a-single-asset-testnets))
- Retrieve collections ([mainnet](https://docs.opensea.io/reference/retrieving-collections), [testnet](https://docs.opensea.io/reference/retrieving-collections-testnets))
- Retrieve a collection ([mainnet](https://docs.opensea.io/reference/retrieving-a-single-collection), [testnet](https://docs.opensea.io/reference/retrieving-a-single-collection-testnets))
- Retrieve collection stats ([mainnet](https://docs.opensea.io/reference/retrieving-collection-stats), [testnet](https://docs.opensea.io/reference/retrieving-collection-stats-testnets))
- Retrieve a contract ([mainnet](https://docs.opensea.io/reference/retrieving-a-single-contract), [testnet](https://docs.opensea.io/reference/retrieving-a-single-contract-testnets))
- Retrieve bundles ([mainnet](https://docs.opensea.io/reference/retrieving-bundles), [tesetnet](https://docs.opensea.io/reference/retrieving-bundles-testnet))
- Retrieve owners ([mainnet](https://docs.opensea.io/reference/retrieve-owners), testnet)

## Wrapped APIs
Developers who focus on target collection can use the wrapped APIs built-in in ```opensea-dev-wrapper```.

To use the wrapped APIs, developers first define a wrap config as

```js
const wrapConfig = {
  'collection': 'dtg-wounderland',
  'contract_address': '0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656',
  'api_key': '',
};
```

Then, developers can define custom query parameters if required as

```js
const queryParams = {
  limit: 5
};
```

Finally, developers can call the wrapped APIs as

```js
async function test() {
  const data = await openseaWrap.testnet.api.getAssetsByCollection(wrapConfig, queryParams);
  console.log(data); 
}

test();
```

### A Complete Example of Wrapped APIs
```js
const {openseaWrap} = require('opensea-dev-wrapper');

const wrapConfig = {
  'collection': 'dtg-wounderland',
  'contract_address': '0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656',
  'api_key': '',
};

const queryParams = {
  limit: 5
};

async function test() {
  const data = await openseaWrap.testnet.api.getAssetsByCollection(wrapConfig, queryParams);
  console.log(data); 
}

test();
``` 

### Built-in Wrapped APIs
- getAssetsByCollection
- getAssetById

## Custom APIs
Developers can also call the custom APIs built-in in ```opensea-dev-wrapper```. For example, developers can check the ownership with the ``checkOwnership``` custom API defined as

```js
/**
  * Mainnet: check if the given account address is the owner of any asset of specified collection or not
  * @param {any} customConfig - Custom config of custom API
  * @param {string} address - Account address
  * @param {any} [retrieveAssetsParams={}] - Custom parameters of native API (retrieveAssets)
  * @param {any} [retrieveAnAssetParams={}] - Custom parameters of native API (retrieveAnAsset)
  * @return {any}
  */
  checkOwnership(customConfig, address, retrieveAssetsParams={}, retrieveAnAssetParams={}) {
```

To use the custom APIs, developers MUST define a custom config as

```js
const customConfig = {
  'collection': 'dtg-wounderland',
  'contract_address': '0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656',
  'api_key': '',
};
```

Then, developers can call the custom APIs with defined parameters as

```js
const address = '0xCB2DeeF8Bff8f948bA8bA655cc6C81D199Ee3D32';
async function test() {
  const data = await openseaWrap.testnet.custom.checkOwnership(customConfig, address);
  console.log(data); 
}

test();
```

### A Complete Example of Custom APIs
```js
const {openseaWrap} = require('opensea-dev-wrapper');

const customConfig = {
  'collection': 'dtg-wounderland',
  'contract_address': '0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656',
  'api_key': '',
};

const address = '0xCB2DeeF8Bff8f948bA8bA655cc6C81D199Ee3D32';
const retrieveAssetsQueryParams = {
  limit: 5,
};

async function test() {
  const data = await openseaWrap.testnet.custom.checkOwnership(customConfig, address, retrieveAssetsQueryParams);
  console.log(data); 
}

test();
```

### Bulit-in Custom APIs
- getAssetIdsByCollection
- getOwnerList (<span style="color:red">**CAUTION**</span>: it takes time if there are too many tokens in target collection.)
- checkOwnership (<span style="color:red">**CAUTION**</span>: it takes time if there are too many tokens in target collection.)

## Release Notes
### v1.1.1
August 10, 2022

***What's New***
- Add native API configs
  - Retrieve collections (mainnet, testnet)
  - Retrieve a collection (mainnet, testnet)
  - Retrieve collection stats (mainnet, testnet)
  - Retrieve a contract (mainnet, testnet)
  - Retrieve bundles (mainnet, tesetnet)
  - Retrieve owners (mainnet, testnet)
- Add custom API
  - getAssetIdsByCollection (mainnet, testnet)

***Bug Fixed***
- getOwnerList and checkOwnership are fixed by fetching all owners (via retrieveOwners native API) instead of top_ownerships (vai retrieveAnAssets native API)

### v1.1.0
August 9, 2022

***What's New***
- Add native API configs
  - Retrieve assets (mainnet, testnet)
  - Retrieve an asset (mainnet, testnet)
- Add wrapped APIs
  - getAssetsByCollection (mainnet, testnet)
  - getAssetById (mainnet, testnet)
- Add custom APIs
  - getOwnerList (mainnet, testnet)
  - checkOwnership (mainnet, testnet)

### v1.0.1
August 7, 2022

First release