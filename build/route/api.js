'use strict';

var _restifyRouter = require('restify-router');

var _qweb = require('qweb3');

var _qweb2 = _interopRequireDefault(_qweb);

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

var _blockchain = require('../api/blockchain');

var _blockchain2 = _interopRequireDefault(_blockchain);

var _wallet = require('../api/wallet');

var _wallet2 = _interopRequireDefault(_wallet);

var _bodhi_token = require('../api/bodhi_token');

var _bodhi_token2 = _interopRequireDefault(_bodhi_token);

var _base_contract = require('../api/base_contract');

var _base_contract2 = _interopRequireDefault(_base_contract);

var _event_factory = require('../api/event_factory');

var _event_factory2 = _interopRequireDefault(_event_factory);

var _topic_event = require('../api/topic_event');

var _topic_event2 = _interopRequireDefault(_topic_event);

var _oracle = require('../api/oracle');

var _oracle2 = _interopRequireDefault(_oracle);

var _centralized_oracle = require('../api/centralized_oracle');

var _centralized_oracle2 = _interopRequireDefault(_centralized_oracle);

var _decentralized_oracle = require('../api/decentralized_oracle');

var _decentralized_oracle2 = _interopRequireDefault(_decentralized_oracle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var qweb3 = new _qweb2.default(_config2.default.QTUM_RPC_ADDRESS);

var apiRouter = new _restifyRouter.Router();

function onRequestSuccess(res, result, next) {
  res.send(200, { result: result });
  next();
}

function onRequestError(res, err, next) {
  res.send(500, { error: err.message });
  next();
}

/* Misc */
apiRouter.post('/is-connected', function (req, res, next) {
  qweb3.isConnected().then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

/* Wallet */
apiRouter.post('/get-account-address', function (req, res, next) {
  _wallet2.default.getAccountAddress(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.get('/list-unspent', function (req, res, next) {
  _wallet2.default.listUnspent().then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

/* Blockchain */
apiRouter.get('/get-block-count', function (req, res, next) {
  _blockchain2.default.getBlockCount().then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/get-transaction-receipt', function (req, res, next) {
  _blockchain2.default.getTransactionReceipt(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/search-logs', function (req, res, next) {
  _blockchain2.default.searchLogs(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

/* BodhiToken */
apiRouter.post('/approve', function (req, res, next) {
  _bodhi_token2.default.approve(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/allowance', function (req, res, next) {
  _bodhi_token2.default.allowance(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/bot-balance', function (req, res, next) {
  _bodhi_token2.default.balanceOf(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

/* BaseContract */
apiRouter.post('/version', function (req, res, next) {
  _base_contract2.default.version(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/get-result', function (req, res, next) {
  _base_contract2.default.resultIndex(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/bet-balances', function (req, res, next) {
  _base_contract2.default.getBetBalances(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/vote-balances', function (req, res, next) {
  _base_contract2.default.getVoteBalances(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/total-bets', function (req, res, next) {
  _base_contract2.default.getTotalBets(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/total-votes', function (req, res, next) {
  _base_contract2.default.getTotalVotes(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

/* EventFactory */
apiRouter.post('/create-topic', function (req, res, next) {
  _event_factory2.default.createTopic(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

/* TopicEvent */
apiRouter.post('/withdraw', function (req, res, next) {
  _topic_event2.default.withdrawWinnings(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/total-qtum-value', function (req, res, next) {
  _topic_event2.default.totalQtumValue(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/total-bot-value', function (req, res, next) {
  _topic_event2.default.totalBotValue(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/final-result', function (req, res, next) {
  _topic_event2.default.getFinalResult(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/status', function (req, res, next) {
  _topic_event2.default.status(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/did-withdraw', function (req, res, next) {
  _topic_event2.default.didWithdraw(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/winnings', function (req, res, next) {
  _topic_event2.default.calculateWinnings(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

/* Oracle */
apiRouter.post('/event-address', function (req, res, next) {
  _oracle2.default.eventAddress(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/consensus-threshold', function (req, res, next) {
  _oracle2.default.consensusThreshold(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/finished', function (req, res, next) {
  _oracle2.default.finished(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

/* CentralizedOracle */
apiRouter.post('/bet', function (req, res, next) {
  _centralized_oracle2.default.bet(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/set-result', function (req, res, next) {
  _centralized_oracle2.default.setResult(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/oracle', function (req, res, next) {
  _centralized_oracle2.default.oracle(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/bet-start-block', function (req, res, next) {
  _centralized_oracle2.default.bettingStartBlock(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/bet-end-block', function (req, res, next) {
  _centralized_oracle2.default.bettingEndBlock(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/result-set-start-block', function (req, res, next) {
  _centralized_oracle2.default.resultSettingStartBlock(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/result-set-end-block', function (req, res, next) {
  _centralized_oracle2.default.resultSettingEndBlock(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

/* DecentralizedOracle */
apiRouter.post('/vote', function (req, res, next) {
  _decentralized_oracle2.default.vote(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/finalize-result', function (req, res, next) {
  _decentralized_oracle2.default.finalizeResult(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/arbitration-end-block', function (req, res, next) {
  _decentralized_oracle2.default.arbitrationEndBlock(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

apiRouter.post('/last-result-index', function (req, res, next) {
  _decentralized_oracle2.default.lastResultIndex(req.params).then(function (result) {
    onRequestSuccess(res, result, next);
  }, function (err) {
    onRequestError(res, err, next);
  });
});

module.exports = apiRouter;