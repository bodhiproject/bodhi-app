require('dotenv').config();
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const winston = require('winston');

const log_config = require('../config/config');

// Create log dir if needed
const logDir = `${path.dirname(require.main.filename)}/logs`;
console.log();
if (!fs.existsSync(logDir)){
    fs.mkdirSync(logDir);
}

var config = winston.config;
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: function() {
        return moment().format("YYYY-MM-DD HH:mm:ss")
      },
      formatter: function(options) {
        return `${options.timestamp()} ${__filename} ${config.colorize(options.level, options.level.toUpperCase())} ${(options.message ? options.message : '')} ${(options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' )}`;
      }
    }),
    new (winston.transports.File)({
      filename: `${logDir}/${moment().format("YYYY-MM-DD")}.log`,
      timestamp: function() {
        return moment().format("YYYY-MM-DD HH:mm:ss")
      }, 
      formatter: function(options) {
        return `${options.timestamp()} ${__filename} ${config.colorize(options.level, options.level.toUpperCase())} ${(options.message ? options.message : '')} ${(options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' )}`;
      },
      json: false,
    })
  ],
  exitOnError: false
});
const loglvl = process.env.loglvl || log_config.DEFAULT_LOGLVL;
logger.level = loglvl;

module.exports = logger;
