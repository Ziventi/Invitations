const log4js = require('log4js');

const APPENDER_NAME = 'ziventi';

/** @type {'debug' | 'info'} */
const LOGGER_LEVEL = 'debug';

log4js.configure({
  appenders: {
    [APPENDER_NAME]: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%[[%x{ln} %p]%] - %m',
        tokens: {
          ln: () => {
            const pad = (value, length = 2) =>
              value.toString().padStart(length, '0');
            const dt = new Date();
            const hour = pad(dt.getHours());
            const min = pad(dt.getMinutes());
            const seconds = pad(dt.getSeconds());
            const ms = pad(dt.getMilliseconds(), 3);
            return `${pad(hour)}:${pad(min)}:${pad(seconds)}.${ms}`;
          }
        }
      }
    }
  },
  categories: {
    default: { appenders: [APPENDER_NAME], level: 'debug' }
  }
});
const logger = log4js.getLogger('cheese');
logger.level = LOGGER_LEVEL;

module.exports = logger;
