import { defineConfig } from "@playwright/test";
import config from "./playwright.config";
export default defineConfig({
  ...config,
  outputDir: "refinement-artifacts/test-results",
  reporter: [["list"], ["html", { outputFolder: "refinement-artifacts/playwright-report", open: "never" }]],
  use: { ...config.use, baseURL: process.env.REFINEMENT_URL ?? "http://127.0.0.1:3138" },
  webServer: process.env.REFINEMENT_URL ? undefined : {
    command: "node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3138",
    url: "http://127.0.0.1:3138", reuseExistingServer: false, timeout: 120000,
  },
});
