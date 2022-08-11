/* eslint-disable max-len */
const expect = require('chai').expect;
const openseaWrap = require('../wrapper/openseaWrapper.js');
const apiConfig = require('../apiConfig/openseaApiConfig.js');
const {setTimeout} = require('core-js');

/**
 * Sleep for ms milliseconds
 * @param {any} ms
 * @return {any}
 */
function wait(ms) {
  return new Promise((resolve) =>setTimeout(() =>resolve(), ms));
};

const defaultTimer = 800;
const infuraTestnetEndpoint = '';
const infuraMainnetEndpoint = '';

const config = {
  'testnet': {
    'collection': 'dtg-wounderland',
    'contract_address': '0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656',
    'schema': 'ERC1155',
    'api_key': '',
    'infura_endpoint': infuraTestnetEndpoint,
  },
  'mainnet721': {
    'collection': 'project-beecasso',
    'contract_address': '0x91146bb8d37324de145acfaa06c53794bf045838',
    'schema': 'ERC721',
    'api_key': '',
    'infura_endpoint': infuraMainnetEndpoint,
  },
  'mainnet': {
    'collection': 'clubgame-items',
    'contract_address': '0x0a495fdcaB693017A50D19ea09945B3889a7707F',
    'schema': 'ERC1155',
    'api_key': '',
    'infura_endpoint': infuraMainnetEndpoint,
  },
};

describe('Testnet', function() {
  describe('Native API Test', function() {
    it('retrieveAssets native API test (success)', async function() {
      await wait(defaultTimer);
      const data = await openseaWrap.testnet.nativeApi(apiConfig.testnet.retrieveAssets);
      expect(data.assets).exist;
    });
  });
  describe('Wrapped APIs Test', function() {
    let tokenId;
    let assetName;
    it('getAssetsByCollection wrapped API test (success)', async function() {
      await wait(defaultTimer);
      const data = await openseaWrap.testnet.api.getAssetsByCollection(config.testnet, {limit: 2});
      tokenId = data.assets[0].token_id;
      assetName = data.assets[0].name;
      expect(data.assets.length).to.equal(2);
    });
    it('getAssetById wrapped API test (success)', async function() {
      await wait(defaultTimer);
      const data = await openseaWrap.testnet.api.getAssetById(config.testnet, tokenId);
      const exptectedRes = assetName;
      expect(data.name).to.equal(exptectedRes);
    });
  });
  describe('Custom APIs Test', function() {
    it('getAssetIdsByCollection custom API test (success)', async function() {
      await wait(defaultTimer);
      const data = await openseaWrap.testnet.custom.getAssetIdsByCollection(config.testnet);
      expect(data.length).to.equal(3);
    });
    let owner;
    it('getOwnerList custom API test (success)', async function() {
      await wait(defaultTimer);
      const data = await openseaWrap.testnet.custom.getOwnerList(config.testnet);
      owner = data.data[0].owners[0].address;
      expect(data.status).to.equal('success');
    });
    it('checkOwnership custom API test (success)', async function() {
      await wait(defaultTimer);
      const data = await openseaWrap.testnet.custom.checkOwnership(config.testnet, owner);
      expect(data.owner).to.equal(true);
    });
  });
});

describe('Mainnet', function() {
  describe('Native API Test', function() {
    it('retrieveAssets native API test (success)', async function() {
      const data = await openseaWrap.mainnet.nativeApi(apiConfig.mainnet.retrieveAssets);
      expect(data.assets).exist;
    });
  });
  describe('Wrapped APIs Test', function() {
    let tokenId;
    let assetName;
    it('getAssetsByCollection wrapped API test (success)', async function() {
      const data = await openseaWrap.mainnet.api.getAssetsByCollection(config.mainnet, {limit: 2});
      tokenId = data.assets[0].token_id;
      assetName = data.assets[0].name;
      expect(data.assets.length).to.equal(1);
    });
    it('getAssetById wrapped API test (success)', async function() {
      const data = await openseaWrap.mainnet.api.getAssetById(config.mainnet, tokenId);
      const exptectedRes = assetName;
      expect(data.name).to.equal(exptectedRes);
    });
  });
  describe('Custom APIs Test', function() {
    it('getAssetIdsByCollection custom API test (success)', async function() {
      await wait(defaultTimer);
      const data = await openseaWrap.mainnet.custom.getAssetIdsByCollection(config.mainnet, {});
      expect(data.length).to.equal(1);
    });
    let owner;
    it('getOwnerList custom API test (success)', async function() {
      await wait(defaultTimer);
      const data = await openseaWrap.mainnet.custom.getOwnerList(config.mainnet);
      owner = data.data[0].owners[0].address;
      expect(data.status).to.equal('success');
    });
    it('checkOwnership custom API test (success)', async function() {
      await wait(defaultTimer);
      const data = await openseaWrap.mainnet.custom.checkOwnership(config.mainnet, owner);
      expect(data.owner).to.equal(true);
    });
  });
});
