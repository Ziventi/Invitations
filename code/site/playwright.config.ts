import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  timeout: 10000,
  webServer: {
    command: 'yarn run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  workers: process.env.CI ? 2 : undefined,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
};

export default config;
