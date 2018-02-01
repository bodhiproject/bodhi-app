import _ from 'lodash';
import Qweb3 from 'qweb3';

import Config from '../config/config';
import ContractMetadata from '../config/contract_metadata';

const qClient = new Qweb3(Config.QTUM_RPC_ADDRESS);

const Blockchain = {
  async getBlockchainInfo() {
    return qClient.getBlockchainInfo();
  },

  async getBlockCount() {
    return qClient.getBlockCount();
  },

  async getTransactionReceipt(args) {
    const {
      transactionId, // string
    } = args;

    if (_.isUndefined(transactionId)) {
      throw new TypeError('transactionId needs to be defined');
    }

    return qClient.getTransactionReceipt(transactionId);
  },

  async searchLogs(args) {
    const {
      fromBlock, // number
      toBlock, // number
    } = args;
    let {
      addresses, // string array
      topics, // string array
    } = args;

    if (_.isUndefined(fromBlock)) {
      throw new TypeError('fromBlock needs to be defined');
    }
    if (_.isUndefined(toBlock)) {
      throw new TypeError('toBlock needs to be defined');
    }

    if (addresses === undefined) {
      addresses = [];
    }

    if (topics === undefined) {
      topics = [];
    }

    return qClient.searchLogs(fromBlock, toBlock, addresses, topics, ContractMetadata, true);
  },
};

module.exports = Blockchain;
