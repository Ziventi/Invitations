const chokidar = require('chokidar');
const log4js = require('log4js');

const { spawn } = require('child_process');
const path = require('path');

log4js.configure({
  appenders: {
    Ziventi: {
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
    default: { appenders: ['Ziventi'], level: 'debug' }
  }
});
const logger = log4js.getLogger('cheese');
logger.level = 'info';

const ROOT = path.resolve(__dirname, '..');

let rebuildInProgress = false;

chokidar
  .watch(['**/*.ts', '*/**/tsconfig.json'], {
    cwd: ROOT,
    ignored: '**/node_modules/**',
    persistent: true,
    awaitWriteFinish: false
  })
  .on('ready', () => {
    logger.info('Watching for TS file changes...');
  })
  .on('change', async (path) => {
    if (!rebuildInProgress) {
      await rebuildProject(path);
      rebuildInProgress = false;
    }
  });

/**
 * Runs a build on the project of a changed file.
 * @param {string} filePath The path of the changed file.
 */
async function rebuildProject(filePath) {
  rebuildInProgress = true;
  const [superDir, project] = filePath.split('/');

  const cwd = superDir === 'projects' ? path.join(superDir, project) : superDir;

  await new Promise((resolve) => {
    logger.info(`Rebuilding project '${cwd}'...'`);
    const child = spawn('npm', ['run', 'build'], {
      cwd: path.join(ROOT, cwd)
    });

    child.stdout.pipe(process.stdout);

    child.on('exit', (err) => {
      if (!err) {
        logger.info(`Rebuilt '${cwd}'.'`);
      }
      resolve();
    });
  });
}
