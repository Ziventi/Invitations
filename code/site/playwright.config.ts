import type { PlaywrightTestConfig } from '@playwright/test';

const port = 3333;

const config: PlaywrightTestConfig = {
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
