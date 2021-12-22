import log4js from 'log4js';

const LOGGER_LEVEL = 'debug';
const APPENDER_NAME = 'ziventi';

const ZLogger = log4js
  .configure({
    appenders: {
      [APPENDER_NAME]: {
        type: 'console',
        layout: {
          type: 'pattern',
          pattern: '%[[%x{ln} %p]%] - %m',
          tokens: {
            ln: () => {
              const pad = (value: number | string, length = 2): string => {
                return value.toString().padStart(length, '0');
              };
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
  })
  .getLogger('cheese');
  ZLogger.level = LOGGER_LEVEL;

export const logger = ZLogger;
