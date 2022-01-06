require('dotenv').config();

const { TEST_PORT } = process.env;

module.exports = {
  server: {
    launchTimeout: 10000,
    command: `PORT=${TEST_PORT} ts-node ./server`,
    port: TEST_PORT
  }
};
