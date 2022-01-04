const { spawn, spawnSync } = require('child_process');
const path = require('path');

const DOCKERFILE = path.resolve(__dirname, 'Dockerfile');
const CONTAINER_NAME = 'ziventi-server';
const IMAGE_NAME = 'ziventi';
const PORT = 3000;

const CWD = path.resolve(__dirname, '..');

(async () => {
  try {
    await run('docker', ['build', '-f', DOCKERFILE, '-t', IMAGE_NAME, '.']);
    const existingContainer = spawnSync(
      'docker',
      ['ps', '-aq', '-f', `name=${CONTAINER_NAME}`],
      { cwd: CWD, encoding: 'utf8' }
    ).stdout.trim();

    if (existingContainer) {
      await run('docker', ['stop', CONTAINER_NAME]);
      await run('docker', ['rm', CONTAINER_NAME]);
    }

    await run('docker', [
      'run',
      '--detach',
      '--name',
      CONTAINER_NAME,
      '--publish',
      `${PORT}:${PORT}`,
      '--restart',
      'unless-stopped',
      IMAGE_NAME,
    ]);
  } catch (e) {
    process.exit(0);
  }
})();

/**
 * Run a Docker CLI command with output.s
 * @param {'docker' | string} cmd The base command.
 * @param {string[]} args The command arguments.
 * @returns {Promise<import('child_process').ChildProcessWithoutNullStreams>} A promise resolving to the process.
 */
function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { cwd: CWD });
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);

    let error = '';

    proc.on('error', reject);
    proc.stderr.on('data', (chunk) => {
      error = chunk.toString();
    });

    proc.on('exit', (code) => {
      if (code === 0) {
        resolve(proc);
      } else {
        reject(error);
      }
    });
  });
}
