import _ from 'lodash';
import { Contract } from 'qweb3';

import Config from '../config/config';
import ContractMetadata from '../config/contract_metadata';

const GAS_LIMIT_CREATE_TOPIC = 3500000;

const contract = new Contract(
  Config.QTUM_RPC_ADDRESS, ContractMetadata.EventFactory.address,
  ContractMetadata.EventFactory.abi,
);

const EventFactory = {
  async createTopic(args) {
    const {
      oracleAddress, // address
      eventName, // string
      resultNames, // string array
      bettingStartBlock, // number
      bettingEndBlock, // number
      resultSettingStartBlock, // number
      resultSettingEndBlock, // number
      senderAddress, // address
    } = args;

    if (_.isUndefined(oracleAddress)) {
      throw new TypeError('oracleAddress needs to be defined');
    }
    if (_.isUndefined(eventName)) {
      throw new TypeError('eventName needs to be defined');
    }
    if (_.isUndefined(resultNames)) {
      throw new TypeError('resultNames needs to be defined');
    }
    if (_.isUndefined(bettingStartBlock)) {
      throw new TypeError('bettingStartBlock needs to be defined');
    }
    if (_.isUndefined(bettingEndBlock)) {
      throw new TypeError('bettingEndBlock needs to be defined');
    }
    if (_.isUndefined(resultSettingStartBlock)) {
      throw new TypeError('resultSettingStartBlock needs to be defined');
    }
    if (_.isUndefined(resultSettingEndBlock)) {
      throw new TypeError('resultSettingEndBlock needs to be defined');
    }
    if (_.isUndefined(senderAddress)) {
      throw new TypeError('senderAddress needs to be defined');
    }

    return contract.send('createTopic', {
      methodArgs: [oracleAddress, eventName, resultNames, bettingStartBlock, bettingEndBlock, resultSettingStartBlock,
        resultSettingEndBlock],
      gasLimit: GAS_LIMIT_CREATE_TOPIC,
      senderAddress,
    });
  },
};

module.exports = EventFactory;
