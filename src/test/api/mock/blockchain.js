module.exports = {
  getTransactionReceipt: {
    result: [
      {
        blockHash: 'c8665533f1ee541a2203bcc17496aa79613ed44c2cf62ead62b4c57de3e6b93d',
        blockNumber: 68269,
        transactionHash: '127531304165ba5fbcdf41f4582f37bf74207cd2d83661a1eb01a425aa0e0047',
        transactionIndex: 2,
        from: '17e7888aa7412a735f336d2f6d784caefabb6fa3',
        to: '0387da9a3e773b559ca0367c5929360e4a4294f6',
        cumulativeGasUsed: 56572,
        gasUsed: 56572,
        contractAddress: '0387da9a3e773b559ca0367c5929360e4a4294f6',
        log: [
          {
            address: 'f6177bc9812eeb531907621af6641a41133dea9e',
            topics: [
              'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
              '0000000000000000000000000387da9a3e773b559ca0367c5929360e4a4294f6',
              '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3',
            ],
            data: '00000000000000000000000000000000000000000000000000000004a817c800',
          },
          {
            address: '0387da9a3e773b559ca0367c5929360e4a4294f6',
            topics: [
              '2b37430897e8d659983fc8ae7ab83ad5b3be5a7db7ea0add5706731c2395f550',
              '0000000000000000000000000000000000000000000000000000000000000000',
              '00000000000000000000000017e7888aa7412a735f336d2f6d784caefabb6fa3',
            ],
            data: '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004a817c800',
          },
        ],
      },
    ],
  },
  searchLogs: {
    result: [
      {
        blockHash: '2aca546e5adb3a6e2ac38c5cba81f2ce40097a8982d8b6ef37795729048c48f3',
        blockNumber: 68245,
        transactionHash: 'e5ffaafc8cf5a239750075ac1866537bc3999561e2bbd7012bc80b24e0338cbb',
        transactionIndex: 2,
        from: '17e7888aa7412a735f336d2f6d784caefabb6fa3',
        to: '97c781c612ad23f4049f253bd52ac2889855f2da',
        cumulativeGasUsed: 43448,
        gasUsed: 43448,
        contractAddress: '97c781c612ad23f4049f253bd52ac2889855f2da',
        log: [
          {
            0: '2',
            _finalResultIndex: '2',
            _version: '0',
            _eventAddress: '0387da9a3e773b559ca0367c5929360e4a4294f6',
            _eventName: 'FinalResultSet',
          },
        ],
      },
    ],
  },
};
