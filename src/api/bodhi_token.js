const _ = require('lodash');
const { Contract } = require('qweb3');

const Config = require('../config/config');
const ContractMetadata = require('../config/contract_metadata');

const contract = new Contract(
  Config.QTUM_RPC_ADDRESS, ContractMetadata.BodhiToken.address,
  ContractMetadata.BodhiToken.abi,
);

const BodhiToken = {
  async approve(args) {
    const {
      spender, // address
      value, // number (Botoshi)
      senderAddress, // address
    } = args;

    if (_.isUndefined(spender)) {
      throw new TypeError('spender needs to be defined');
    }
    if (_.isUndefined(value)) {
      throw new TypeError('value needs to be defined');
    }
    if (_.isUndefined(senderAddress)) {
      throw new TypeError('senderAddress needs to be defined');
    }

    return contract.send('approve', {
      methodArgs: [spender, value],
      senderAddress,
    });
  },

  async allowance(args) {
    const {
      owner, // address
      spender, // address
      senderAddress, // address
    } = args;

    if (_.isUndefined(owner)) {
      throw new TypeError('owner needs to be defined');
    }
    if (_.isUndefined(spender)) {
      throw new TypeError('spender needs to be defined');
    }
    if (_.isUndefined(senderAddress)) {
      throw new TypeError('senderAddress needs to be defined');
    }

    return contract.call('allowance', {
      methodArgs: [owner, spender],
      senderAddress,
    });
  },

  async balanceOf(args) {
    const {
      owner, // address
      senderAddress, // address
    } = args;

    if (_.isUndefined(owner)) {
      throw new TypeError('owner needs to be defined');
    }
    if (_.isUndefined(senderAddress)) {
      throw new TypeError('senderAddress needs to be defined');
    }

    return contract.call('balanceOf', {
      methodArgs: [owner],
      senderAddress,
    });
  },
};

module.exports = BodhiToken;
