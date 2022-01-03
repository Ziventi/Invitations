const { spawn } = require('child_process');
const path = require('path');

const DOCKERFILE = path.resolve(__dirname, 'Dockerfile');
const CONTAINER_NAME = 'ziventi-server';
const IMAGE_NAME = 'ziventi';
const PORT = 3000;

(async () => {
  await run('docker', ['build', '-f', DOCKERFILE, '-t', IMAGE_NAME, '.']);
  const { stdout: containerExists } = await run('docker', [
    'ps',
    '-aq',
    '-f',
    `name=${CONTAINER_NAME}`,
  ]);
  if (containerExists) {
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
})();

/**
 * Run a Docker CLI command with output.s
 * @typedef {import('child_process').ChildProcessWithoutNullStreams>} Process
 * @param {'docker' | string} cmd The base command.
 * @param {string[]} args The command arguments.
 * @returns {Promise<Process>} A promise resolving to the process.
 */
function run(cmd, args) {
  return new Promise((resolve) => {
    const proc = spawn(cmd, args, {
      cwd: path.resolve(__dirname, '..'),
    });
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);

    proc.on('error', (e) => {
      throw e;
    });

    proc.on('close', () => {
      resolve(proc);
    });
  });
}
