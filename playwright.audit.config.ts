import { defineConfig } from '@playwright/test';
import config from './playwright.config';
export default defineConfig({ ...config, outputDir: 'audit-artifacts/test-results', reporter: [['list'], ['html', { outputFolder: 'audit-artifacts/playwright-report', open: 'never' }]], use: { ...config.use, baseURL: 'http://127.0.0.1:3002' }, webServer: { command: 'node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3002', url: 'http://127.0.0.1:3002', reuseExistingServer: true, timeout: 120000 } });
