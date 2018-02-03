const _ = require('lodash');
const { Contract } = require('qweb3');

const Config = require('../config/config');
const ContractMetadata = require('../config/contract_metadata');

const GAS_LIMIT_VOTE = 1500000;

function getContract(contractAddress) {
  return new Contract(Config.QTUM_RPC_ADDRESS, contractAddress, ContractMetadata.DecentralizedOracle.abi);
}

const DecentralizedOracle = {
  async vote(args) {
    const {
      contractAddress, // address
      resultIndex, // number
      botAmount, // number (Botoshi)
      gasLimit, // number
      senderAddress, // address
    } = args;

    if (_.isUndefined(contractAddress)) {
      throw new TypeError('contractAddress needs to be defined');
    }
    if (_.isUndefined(resultIndex)) {
      throw new TypeError('resultIndex needs to be defined');
    }
    if (_.isUndefined(botAmount)) {
      throw new TypeError('botAmount needs to be defined');
    }
    if (_.isUndefined(senderAddress)) {
      throw new TypeError('senderAddress needs to be defined');
    }

    // If gasLimit is not specified, we need to make sure the vote succeeds in the event this vote will surpass the
    // consensus threshold and will require a higher gas limit.
    const contract = getContract(contractAddress);
    return contract.send('voteResult', {
      methodArgs: [resultIndex, botAmount],
      gasLimit: gasLimit || GAS_LIMIT_VOTE,
      senderAddress,
    });
  },

  async finalizeResult(args) {
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
    return contract.send('finalizeResult', {
      methodArgs: [],
      senderAddress,
    });
  },

  async arbitrationEndBlock(args) {
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
    return contract.call('arbitrationEndBlock', {
      methodArgs: [],
      senderAddress,
    });
  },

  async lastResultIndex(args) {
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
    return contract.call('lastResultIndex', {
      methodArgs: [],
      senderAddress,
    });
  },
};

module.exports = DecentralizedOracle;
