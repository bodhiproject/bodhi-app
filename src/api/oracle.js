const _ = require('lodash');
const { Contract } = require('qweb3');

const Config = require('../config/config');
const ContractMetadata = require('../config/contract_metadata');

const ORACLE_CENTRALIZED = 'centralized';
const ORACLE_DECENTRALIZED = 'decentralized';

function getContract(oracleType, contractAddress) {
  switch (oracleType) {
    case ORACLE_CENTRALIZED: {
      return new Contract(Config.QTUM_RPC_ADDRESS, contractAddress, ContractMetadata.CentralizedOracle.abi);
    }
    case ORACLE_DECENTRALIZED: {
      return new Contract(Config.QTUM_RPC_ADDRESS, contractAddress, ContractMetadata.DecentralizedOracle.abi);
    }
    default: {
      throw new TypeError('Invalid oracle type');
    }
  }
}

const Oracle = {
  async eventAddress(args) {
    const {
      contractAddress, // address
      oracleType, // string
      senderAddress, // address
    } = args;

    if (_.isUndefined(contractAddress)) {
      throw new TypeError('contractAddress needs to be defined');
    }
    if (_.isUndefined(oracleType)) {
      throw new TypeError('oracleType needs to be defined');
    }
    if (_.isUndefined(senderAddress)) {
      throw new TypeError('senderAddress needs to be defined');
    }

    const oracle = getContract(oracleType, contractAddress);
    return oracle.call('eventAddress', {
      methodArgs: [],
      senderAddress,
    });
  },

  async consensusThreshold(args) {
    const {
      contractAddress, // address
      oracleType, // string
      senderAddress, // address
    } = args;

    if (_.isUndefined(contractAddress)) {
      throw new TypeError('contractAddress needs to be defined');
    }
    if (_.isUndefined(oracleType)) {
      throw new TypeError('oracleType needs to be defined');
    }
    if (_.isUndefined(senderAddress)) {
      throw new TypeError('senderAddress needs to be defined');
    }

    const oracle = getContract(oracleType, contractAddress);
    return oracle.call('consensusThreshold', {
      methodArgs: [],
      senderAddress,
    });
  },

  async finished(args) {
    const {
      contractAddress, // address
      oracleType, // string
      senderAddress, // address
    } = args;

    if (_.isUndefined(contractAddress)) {
      throw new TypeError('contractAddress needs to be defined');
    }
    if (_.isUndefined(oracleType)) {
      throw new TypeError('oracleType needs to be defined');
    }
    if (_.isUndefined(senderAddress)) {
      throw new TypeError('senderAddress needs to be defined');
    }

    const oracle = getContract(oracleType, contractAddress);
    return oracle.call('finished', {
      methodArgs: [],
      senderAddress,
    });
  },
};

module.exports = Oracle;
