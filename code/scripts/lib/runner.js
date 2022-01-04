const { spawn, spawnSync } = require('child_process');

const logger = require('./logger');

module.exports = (cwd) => {
  /**
   * Runs a child process and pipes output to console.
   * @param {string} cmd The base command.
   * @param {string[]} args The command arguments.
   * @returns The child process instance.
   */
  function run(cmd, args) {
    return new Promise((resolve, reject) => {
      const proc = spawn(cmd, args, { cwd });
      proc.stdout.pipe(process.stdout);
      proc.stderr.pipe(process.stderr);

      let error = '';

      proc.on('error', (e) => {
        throw new Error(e);
      });

      proc.stderr.on('data', (chunk) => {
        error = chunk.toString();
      });

      proc.on('exit', (code) => {
        if (code === 0) {
          resolve(proc);
        } else {
          throw new Error(error);
        }
      });
    });
  }

  /**
   * Runs a child process silently and synchronously.
   * @param {string} cmd The base command.
   * @param {string[]} args The command arguments.
   */
  function runSilent(cmd, args) {
    const proc = spawnSync(cmd, args, { cwd, encoding: 'utf8' });

    if (proc.error) {
      throw proc.error;
    } else {
      const output = proc.output.filter((chunk) => chunk).join().trim();
      return output;
    }
  }

  return {
    run,
    runSilent
  };
};
