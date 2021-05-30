const logger = require('debug')('app:startup'); /* app:start need to be the value of DEBUG environment variable to get startupdebeggur */
const dblogger = require('debug')('app:db'); 

const log = (exp) => logger(exp);
const dblog = (exp) => dblogger(exp);

module.export = log;