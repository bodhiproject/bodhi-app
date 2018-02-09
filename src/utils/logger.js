require('dotenv').config();
const fs = require('fs');
const moment = require('moment');
const winston = require('winston');

const Utils = require('./utils');
const config = require('../config/config');

const LOG_DIR = `${Utils.getRootPath()}/logs`;

// Create log dir if needed
console.log(`Logs output: ${LOG_DIR}`);
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

const winstonCfg = winston.config;
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
      },
      formatter(options) {
        return `${options.timestamp()} ${winstonCfg.colorize(options.level, options.level.toUpperCase())} ${(options.message ? options.message : '')} ${(options.meta && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : '')}`;
      },
    }),
    new (winston.transports.File)({
      filename: `${LOG_DIR}/bodhiapp_${moment().format('YYYYMMDD_HHmmss')}.log`,
      timestamp() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
      },
      formatter(options) {
        return `${options.timestamp()} ${winstonCfg.colorize(options.level, options.level.toUpperCase())} ${(options.message ? options.message : '')} ${(options.meta && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : '')}`;
      },
      json: false,
    }),
  ],
  exitOnError: false,
});

const loglvl = process.env.loglvl || config.DEFAULT_LOGLVL;
logger.level = loglvl;

module.exports = logger;
