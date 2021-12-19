const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = path.join(process.cwd(), 'projects');

spawnSync('rm', ['-rf', '.dist', '.out'], {
  cwd: path.join(process.cwd(), '.cache')
});

fs.readdirSync(PROJECTS_DIR)
  .map((name) => path.join(PROJECTS_DIR, name))
  .forEach((directory) => {
    spawnSync('rm', ['-rf', '.dist', '.out'], {
      cwd: directory
    });
  });
