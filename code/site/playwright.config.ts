import type { PlaywrightTestConfig } from '@playwright/test';
import 'dotenv/config';

const port = 3333;

const config: PlaywrightTestConfig = {
  expect: {
    timeout: 100,
  },
  timeout: 10000,
  use: {
    baseURL: `http://localhost:${port}`,
    headless: true,
  },
  webServer: {
    command: `yarn run dev -p ${port}`,
    port,
    reuseExistingServer: !process.env.CI,
  },
  workers: process.env.CI ? 2 : undefined,
};

export default config;
