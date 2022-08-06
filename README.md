# opensea-dev-wrapper<!-- omit in toc -->
A JavaScript software development kit (SDK) for easily interacting with original OpenSea SDK, API, or contracts.

## Table of Content<!-- omit in toc -->

- [Installation](#installation)
- [Getting Started](#getting-started)

## Installation
In your project, run
```shell
npm i opensea-dev-wrapper --save
```

## Getting Started
First of all, use ```require()``` to include ```opensea-dev-wrapper```.

```js
const opensea = require('opensea-dev-wrapper');
```

To specify the collection of OpenSea you are interested in, define an object as

```js
const collection = {
  'collection': 'project-beecasso',
  'contract_address': '0x91146bb8d37324de145acfaa06c53794bf045838',
  'api_key': '',
};
```

Then, get assets by the collection

```js
async function test() {
  const res = await opensea.mainnet.api.getAssetsByCollection(collection, {limit: 2});
  console.log(res); 
}

test();
```