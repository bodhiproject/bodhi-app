const _ = require('lodash');
const { Contract } = require('qweb3');

const Config = require('../config/config');
const ContractMetadata = require('../config/contract_metadata');

function getContract(contractAddress) {
  return new Contract(Config.QTUM_RPC_ADDRESS, contractAddress, ContractMetadata.TopicEvent.abi);
}

const TopicEvent = {
  async withdrawWinnings(args) {
    const {
      contractAddress, // address
      senderAddress, // address
    } = args;

    if (_.isUndefined(contractAddress)) {
      throw new TypeError('contractAddress needs to be defined');
    }
    if (_.isUndefined(senderAddress)) {
      throw new TypeError('senderAddress needs to be defined');
    }

    const contract = getContract(contractAddress);
    return contract.send('withdrawWinnings', {
      methodArgs: [],
      senderAddress,
    });
  },

  async totalQtumValue(args) {
    const {
      contractAddress, // address
      senderAddress, // address
    } = args;

    if (_.isUndefined(contractAddress)) {
      throw new TypeError('contractAddress needs to be defined');
    }
    if (_.isUndefined(senderAddress)) {
      throw new TypeError('senderAddress needs to be defined');
    }

    const contract = getContract(contractAddress);
    return contract.call('totalQtumValue', {
      methodArgs: [],
      senderAddress,
    });
  },

  async totalBotValue(args) {
    const {
      contractAddress, // address
      senderAddress, // address
    } = args;

    if (_.isUndefined(contractAddress)) {
      throw new TypeError('contractAddress needs to be defined');
    }
    if (_.isUndefined(senderAddress)) {
      throw new TypeError('senderAddress needs to be defined');
    }

    const contract = getContract(contractAddress);
    return contract.call('totalBotValue', {
      methodArgs: [],
      senderAddress,
    });
  },

  async getFinalResult(args) {
    const {
      contractAddress, // address
      senderAddress, // address
    } = args;

    if (_.isUndefined(contractAddress)) {
      throw new TypeError('contractAddress needs to be defined');
    }
    if (_.isUndefined(senderAddress)) {
      throw new TypeError('senderAddress needs to be defined');
    }

    const contract = getContract(contractAddress);
    return contract.call('getFinalResult', {
      methodArgs: [],
      senderAddress,
    });
  },

  async status(args) {
    const {
      contractAddress, // address
      senderAddress, // address
    } = args;

    if (_.isUndefined(contractAddress)) {
      throw new TypeError('contractAddress needs to be defined');
    }
    if (_.isUndefined(senderAddress)) {
      throw new TypeError('senderAddress needs to be defined');
    }

    const contract = getContract(contractAddress);
    return contract.call('status', {
      methodArgs: [],
      senderAddress,
    });
  },

  async didWithdraw(args) {
    const {
      contractAddress, // address
      address, // address
      senderAddress, // address
    } = args;

    if (_.isUndefined(contractAddress)) {
      throw new TypeError('contractAddress needs to be defined');
    }
    if (_.isUndefined(address)) {
      throw new TypeError('address needs to be defined');
    }
    if (_.isUndefined(senderAddress)) {
      throw new TypeError('senderAddress needs to be defined');
    }

    const contract = getContract(contractAddress);
    return contract.call('didWithdraw', {
      methodArgs: [address],
      senderAddress,
    });
  },

  async calculateWinnings(args) {
    const {
      contractAddress, // address
      senderAddress, // address
    } = args;

    if (_.isUndefined(contractAddress)) {
      throw new TypeError('contractAddress needs to be defined');
    }
    if (_.isUndefined(senderAddress)) {
      throw new TypeError('senderAddress needs to be defined');
    }

    const contract = getContract(contractAddress);
    return contract.call('calculateWinnings', {
      methodArgs: [],
      senderAddress,
    });
  },
};

module.exports = TopicEvent;
