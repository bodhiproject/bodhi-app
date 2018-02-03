const _ = require('lodash');
const Contract = require('qweb3');

const Config = require('../config/config');
const ContractMetadata = require('../config/contract_metadata');

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
      bettingStartTime, // string: unix time
      bettingEndTime, // string: unix time
      resultSettingStartTime, // string: unix time
      resultSettingEndTime, // string: unix time
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
    if (_.isUndefined(bettingStartTime)) {
      throw new TypeError('bettingStartTime needs to be defined');
    }
    if (_.isUndefined(bettingEndTime)) {
      throw new TypeError('bettingEndTime needs to be defined');
    }
    if (_.isUndefined(resultSettingStartTime)) {
      throw new TypeError('resultSettingStartTime needs to be defined');
    }
    if (_.isUndefined(resultSettingEndTime)) {
      throw new TypeError('resultSettingEndTime needs to be defined');
    }
    if (_.isUndefined(senderAddress)) {
      throw new TypeError('senderAddress needs to be defined');
    }

    return contract.send('createTopic', {
      methodArgs: [oracleAddress, eventName, resultNames, bettingStartTime, bettingEndTime, resultSettingStartTime,
        resultSettingEndTime],
      gasLimit: GAS_LIMIT_CREATE_TOPIC,
      senderAddress,
    });
  },
};

module.exports = EventFactory;
