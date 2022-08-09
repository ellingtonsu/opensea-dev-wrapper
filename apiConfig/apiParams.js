module.exports = {
  common: {
    retrieveAContract: {
      pathParams: {
        asset_contract_address: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
      },
      queryParams: {},
    },
    retrieveBundles: {
      pathParams: {},
      queryParams: {
        offset: 0,
        limit: 20,
      },
    },
    retrieveCollectionStats: {
      pathParams: {
        collection_slug: 'doodles-official',
        stats: 'stats',
      },
      queryParams: {},
    },
    retrieveACollection: {
      pathParams: {
        collection_slug: 'doodles-official',
      },
      queryParams: {},
    },
    retrieveCollections: {
      pathParams: {},
      queryParams: {
        offset: 0,
        limit: 20,
      },
    },
    retrieveAssets: {
      pathParams: {},
      queryParams: {
        order_direction: 'desc',
        limit: 20,
        include_orders: false,
      },
    },
    retrieveAnAsset: {
      pathParams: {
        asset_contract_address: '0x381748c76f2b8871afbbe4578781cd24df34ae0d',
        token_id: '0',
      },
      queryParams: {
        include_orders: false,
      },
    },
  },
  mainnet: {
    retrieveOwners: {
      pathParams: {
        asset_contract_address: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
        token_id: '1',
        owners: 'owners',
      },
      queryParams: {
        order_direction: 'desc',
        limit: 20,
        order_by: 'created_date',
      },
    },
  },
};
