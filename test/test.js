/* eslint-disable max-len */
const expect = require('chai').expect;
const opensea = require('../wrapper/openseaWrapper.js');

const collections = {
  'testnet': {
    'collection': 'dtg-wounderland',
    'contract_address': '0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656',
    'api_key': '',
  },
  'mainnet': {
    'collection': 'project-beecasso',
    'contract_address': '0x91146bb8d37324de145acfaa06c53794bf045838',
    'api_key': '',
  },
};

describe('Testnet', function() {
  let assetId;
  describe('api test', function() {
    it('getAssetsByCollection success test', async function() {
      const res = await opensea.testnet.api.getAssetsByCollection(collections.testnet, {limit: 2});
      const assetIds = [];
      res.assets.forEach((asset) => assetIds.push(asset.token_id));
      assetId = assetIds[0];
      const exptectedRes = [
        '91900665702232483317502896843788391343945052347484836230427277169618352865930',
        '91900665702232483317502896843788391343945052347484836230427277168518841237754',
      ];
      expect(assetIds).to.deep.equal(exptectedRes);
    });
    it('getAssetById success test', async function() {
      const res = await opensea.testnet.api.getAssetById(collections.testnet, assetId);
      const exptectedRes = '音寶';
      expect(res.name).to.equal(exptectedRes);
    });
  });
  describe('custom test', function() {
    let owner;
    it('getOwnerList success test', async function() {
      const res = await opensea.testnet.custom.getOwnerList(collections.testnet, {limit: 2});
      owner = res.data[0].owners[0].address;
      expect(res.status).to.equal('success');
    });
    it('checkOwnership success test', async function() {
      const res = await opensea.testnet.custom.checkOwnership(collections.testnet, owner, {limit: 2});
      expect(res.owner).to.equal(true);
    });
  });
});

describe('Mainnet', function() {
  let assetId;
  describe('api test', function() {
    it('getAssetsByCollection success test', async function() {
      const res = await opensea.mainnet.api.getAssetsByCollection(collections.mainnet, {limit: 2});
      const assetIds = [];
      res.assets.forEach((asset) => assetIds.push(asset.token_id));
      assetId = assetIds[0];
      const exptectedRes = [
        '99858714975093628077684190452527207669783709549204884194549158759794927992947',
        '99858714975093628077684190452527207669783709549204884194549158759794927992946',
      ];
      expect(assetIds).to.deep.equal(exptectedRes);
    });
    it('getAssetById success test', async function() {
      const res = await opensea.mainnet.api.getAssetById(collections.mainnet, assetId);
      const exptectedRes = 'SUNMAI for LOVE #099';
      expect(res.name).to.equal(exptectedRes);
    });
  });
  describe('custom test', function() {
    let owner;
    it('getOwnerList success test', async function() {
      const res = await opensea.mainnet.custom.getOwnerList(collections.mainnet, {limit: 2});
      owner = res.data[0].owners[0].address;
      expect(res.status).to.equal('success');
    });
    it('checkOwnership success test', async function() {
      const res = await opensea.mainnet.custom.checkOwnership(collections.mainnet, owner, {limit: 2});
      expect(res.owner).to.equal(true);
    });
  });
});
