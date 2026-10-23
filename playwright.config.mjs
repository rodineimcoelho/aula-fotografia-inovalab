import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./tests/browser',
  fullyParallel:false,
  workers:1,
  reporter:'list',
  timeout:45000,
  use:{baseURL:'http://127.0.0.1:5173',channel:'chrome',headless:true,viewport:{width:1440,height:900},trace:'retain-on-failure'},
  outputDir:'.impeccable/review/test-results',
});
