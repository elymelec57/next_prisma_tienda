import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Configuration
 * Docs: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    // ─── Test files location ─────────────────────────────────────────────────
    testDir: './e2e/tests',
    outputDir: './e2e/results',

    // ─── Global settings ─────────────────────────────────────────────────────
    /* Max test timeout */
    timeout: 30_000,

    /* Fail the build on CI if you accidentally left test.only in source code */
    forbidOnly: !!process.env.CI,

    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,

    /* Reporter to use */
    reporter: [
        ['list'],
        ['html', { outputFolder: 'e2e/playwright-report', open: 'never' }],
    ],

    // ─── Shared settings for all projects ────────────────────────────────────
    use: {
        /* Base URL of the Next.js dev server */
        baseURL: process.env.BASE_URL ?? 'http://localhost:3000',

        /* Collect trace when retrying the failed test */
        trace: 'on-first-retry',

        /* Take screenshot on failure */
        screenshot: 'only-on-failure',

        /* Record video on failure */
        video: 'on-first-retry',

        /* Reduce flakiness */
        actionTimeout: 10_000,
        navigationTimeout: 15_000,
    },

    // ─── Projects / browsers ─────────────────────────────────────────────────
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        /* Uncomment to test on more browsers:
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
        */
    ],

    // ─── Web server ──────────────────────────────────────────────────────────
    /* Playwright can start the Next.js dev server automatically.
     * Uncomment this block if you prefer it over running `npm run dev` manually.
     */
    webServer: {
        command: process.env.CI ? 'npm run start' : 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
