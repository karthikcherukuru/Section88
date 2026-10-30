import { defineConfig } from "@playwright/test";
import config from "./playwright.config";

export default defineConfig({
  ...config,
  outputDir: "hero-artifacts/test-results",
  reporter: [["list"], ["html", { outputFolder: "hero-artifacts/playwright-report", open: "never" }]],
  use: { ...config.use, baseURL: "http://127.0.0.1:3188" },
  webServer: {
    command: "node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3188",
    url: "http://127.0.0.1:3188", reuseExistingServer: true, timeout: 120_000,
  },
});
