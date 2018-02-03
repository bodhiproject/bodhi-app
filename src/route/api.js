const { Router } = require('restify-router');
const { Qweb3 } = require('qweb3');

const Config = require('../config/config');
const Blockchain = require('../api/blockchain');
const Wallet = require('../api/wallet');
const BodhiToken = require('../api/bodhi_token');
const BaseContract = require('../api/base_contract');
const EventFactory = require('../api/event_factory');
const TopicEvent = require('../api/topic_event');
const Oracle = require('../api/oracle');
const CentralizedOracle = require('../api/centralized_oracle');
const DecentralizedOracle = require('../api/decentralized_oracle');

const qweb3 = new Qweb3(Config.QTUM_RPC_ADDRESS);

const apiRouter = new Router();

function onRequestSuccess(res, result, next) {
  res.send(200, { result });
  next();
}

function onRequestError(res, err, next) {
  res.send(500, { error: err.message });
  next();
}

/* Misc */
apiRouter.post('/is-connected', (req, res, next) => {
  qweb3.isConnected()
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

/* Wallet */
apiRouter.post('/get-account-address', (req, res, next) => {
  Wallet.getAccountAddress(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.get('/list-unspent', (req, res, next) => {
  Wallet.listUnspent()
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

/* Blockchain */
apiRouter.post('/get-block', (req, res, next) => {
  Blockchain.getBlock(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.get('/get-blockchain-info', (req, res, next) => {
  Blockchain.getBlockchainInfo()
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.get('/get-block-count', (req, res, next) => {
  Blockchain.getBlockCount()
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/get-transaction-receipt', (req, res, next) => {
  Blockchain.getTransactionReceipt(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/search-logs', (req, res, next) => {
  Blockchain.searchLogs(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

/* BodhiToken */
apiRouter.post('/approve', (req, res, next) => {
  BodhiToken.approve(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/allowance', (req, res, next) => {
  BodhiToken.allowance(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/bot-balance', (req, res, next) => {
  BodhiToken.balanceOf(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

/* BaseContract */
apiRouter.post('/version', (req, res, next) => {
  BaseContract.version(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/get-result', (req, res, next) => {
  BaseContract.resultIndex(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/bet-balances', (req, res, next) => {
  BaseContract.getBetBalances(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/vote-balances', (req, res, next) => {
  BaseContract.getVoteBalances(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/total-bets', (req, res, next) => {
  BaseContract.getTotalBets(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/total-votes', (req, res, next) => {
  BaseContract.getTotalVotes(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

/* EventFactory */
apiRouter.post('/create-topic', (req, res, next) => {
  EventFactory.createTopic(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

/* TopicEvent */
apiRouter.post('/withdraw', (req, res, next) => {
  TopicEvent.withdrawWinnings(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/total-qtum-value', (req, res, next) => {
  TopicEvent.totalQtumValue(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/total-bot-value', (req, res, next) => {
  TopicEvent.totalBotValue(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/final-result', (req, res, next) => {
  TopicEvent.getFinalResult(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/status', (req, res, next) => {
  TopicEvent.status(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/did-withdraw', (req, res, next) => {
  TopicEvent.didWithdraw(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/winnings', (req, res, next) => {
  TopicEvent.calculateWinnings(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

/* Oracle */
apiRouter.post('/event-address', (req, res, next) => {
  Oracle.eventAddress(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/consensus-threshold', (req, res, next) => {
  Oracle.consensusThreshold(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/finished', (req, res, next) => {
  Oracle.finished(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

/* CentralizedOracle */
apiRouter.post('/bet', (req, res, next) => {
  CentralizedOracle.bet(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/set-result', (req, res, next) => {
  CentralizedOracle.setResult(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/oracle', (req, res, next) => {
  CentralizedOracle.oracle(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/bet-start-block', (req, res, next) => {
  CentralizedOracle.bettingStartBlock(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/bet-end-block', (req, res, next) => {
  CentralizedOracle.bettingEndBlock(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/result-set-start-block', (req, res, next) => {
  CentralizedOracle.resultSettingStartBlock(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/result-set-end-block', (req, res, next) => {
  CentralizedOracle.resultSettingEndBlock(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

/* DecentralizedOracle */
apiRouter.post('/vote', (req, res, next) => {
  DecentralizedOracle.vote(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/finalize-result', (req, res, next) => {
  DecentralizedOracle.finalizeResult(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/arbitration-end-block', (req, res, next) => {
  DecentralizedOracle.arbitrationEndBlock(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

apiRouter.post('/last-result-index', (req, res, next) => {
  DecentralizedOracle.lastResultIndex(req.params)
    .then((result) => {
      onRequestSuccess(res, result, next);
    }, (err) => {
      onRequestError(res, err, next);
    });
});

module.exports = apiRouter;
