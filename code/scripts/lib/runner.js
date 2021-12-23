const { spawn, spawnSync } = require('child_process');

const logger = require('./logger');

module.exports = (cwd) => {
  /**
   * Runs a child process and pipes output to console.
   * @param {string} cmd The base command.
   * @param {string[]} args The command arguments.
   * @param {() => void} onClose Code to run on closing the process.
   * @returns The child process instance.
   */
  function run(cmd, args, onClose) {
    const proc = spawn(cmd, args, { cwd });
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);

    proc.on('error', (e) => {
      logger.error(e);
      process.exit(1);
    });

    if (onClose) {
      proc.on('close', () => {
        onClose();
      });
    }
    return proc;
  }

  /**
   * Runs a child process silently and synchronously.
   * @param {string} cmd The base command.
   * @param {string[]} args The command arguments.
   */
  function runSilent(cmd, args) {
    spawnSync(cmd, args, { cwd });
  }

  return {
    run,
    runSilent
  };
};
