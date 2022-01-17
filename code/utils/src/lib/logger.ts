import format from 'date-fns/format';
import * as log4js from 'log4js';

const LOGGER_LEVEL = 'debug';

log4js.configure({
  appenders: {
    Default: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%[[%x{ln} %p]%] - %m',
        tokens: {
          ln: () => {
            return format(new Date(), 'HH:mm:ss:SSS');
          },
        },
      },
    },
    Server: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%[[%x{ln} %p]%] - %m',
        tokens: {
          ln: () => {
            return format(new Date(), 'E-dd-MMM-yyyy HH:mm:ss:SSS');
          },
        },
      },
    },
  },
  categories: {
    default: { appenders: ['Server'], level: LOGGER_LEVEL },
    server: { appenders: ['Server'], level: LOGGER_LEVEL },
  },
});

export default log4js;
export const logger = log4js.getLogger('default');
