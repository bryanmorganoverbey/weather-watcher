require('dotenv').config();
const { chromium } = require('playwright');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * Weather Watcher - AccuWeather Radar Automation
 *
 * This script automates viewing the AccuWeather radar for Nashville, TN:
 * - Opens browser to the weather radar page
 * - Makes the browser full screen
 * - Clicks the full-screen button on the radar UI
 * - Starts the radar animation
 * - Runs for 10 minutes then closes and restarts
 *
 * Platform Support:
 * - macOS: Runs in headed mode for local debugging
 * - Debian/Docker: Runs with Xvfb virtual display
 */

// Platform configuration from environment
const PLATFORM = process.env.PLATFORM || 'macos';
const IS_MACOS = PLATFORM.toLowerCase() === 'macos';
const IS_DEBIAN = PLATFORM.toLowerCase() === 'debian';

// Constants
const WEATHER_URL = 'https://www.accuweather.com/en/us/nashville/37243/weather-radar/351090';
const RUN_DURATION_MS = 10 * 60 * 1000; // 10 minutes in milliseconds
const RESTART_DELAY_MS = 5000; // 5 seconds between restarts
const ERROR_RETRY_DELAY_MS = 30000; // 30 seconds retry delay on errors
const PAGE_LOAD_TIMEOUT_MS = 120000; // 120 seconds (2 minutes) timeout for page load - generous for Raspberry Pi

// Log platform configuration
console.log('=================================');
console.log('Platform Configuration');
console.log('=================================');
console.log(`Platform: ${PLATFORM}`);
console.log(`Running on macOS: ${IS_MACOS}`);
console.log(`Running on Debian: ${IS_DEBIAN}`);
console.log('');

async function runWeatherWatcher() {
    let browser;
    let context;
    let page;

    try {
        console.log('=================================');
        console.log('Starting Weather Watcher...');
        console.log('=================================');
        console.log('');

        // Launch browser with platform-specific configuration
        console.log('Launching browser...');

        const launchOptions = {
            headless: false, // Run in headed mode to display the UI
            args: [
                '--disable-infobars',
                '--no-default-browser-check'
            ]
        };

        browser = await chromium.launch(launchOptions);

        // Create a new browser context
        context = await browser.newContext({
            viewport: null, // Disable viewport to allow full screen
            acceptDownloads: false
        });

        // Create a new page
        page = await context.newPage();

        // Navigate to AccuWeather radar page
        console.log(`Navigating to ${WEATHER_URL}...`);
        await page.goto(WEATHER_URL, {
            waitUntil: 'domcontentloaded',
            timeout: PAGE_LOAD_TIMEOUT_MS
        });

        // Wait for the page to fully load and render (generous time for Raspberry Pi)
        console.log('Waiting for page to fully load...');
        await page.waitForTimeout(15000); // 15 seconds for page to settle and load all resources

        // Try to close any cookie/privacy banners that might appear
        try {
            const privacyButtons = [
                'button:has-text("Accept")',
                'button:has-text("Agree")',
                'button:has-text("I Accept")',
                'button:has-text("Close")',
                '[aria-label="Close"]'
            ];

            for (const selector of privacyButtons) {
                const button = await page.$(selector);
                if (button && await button.isVisible()) {
                    console.log('Closing privacy banner...');
                    await button.click();
                    await page.waitForTimeout(2000); // Extra time for banner to close
                    break;
                }
            }
        } catch (error) {
            // Ignore errors if banner doesn't exist
            console.log('No privacy banner to close');
        }

        // Find and click the full-screen button in the radar UI
        console.log('Looking for full-screen button in radar UI...');

        // Wait for radar/map to be fully loaded and visible (generous time for Raspberry Pi)
        console.log('Waiting for radar to load...');
        await page.waitForTimeout(8000); // 8 seconds for radar to render

        // Click the full-screen button
        try {
            await page.locator('.full-screen-button').click();
            console.log('Clicked full-screen button');
            await page.waitForTimeout(3000); // Extra time for fullscreen animation
        } catch (error) {
            console.log('Full-screen button not found, continuing anyway...');
        }

        // Find and click the play button
        console.log('Looking for play button...');
        await page.waitForTimeout(3000); // Extra time before clicking play

        // Click the play button
        try {
            await page.locator('.play-bar-toggle').click();
            console.log('Clicked play button');
            await page.waitForTimeout(2000); // Extra time for animation to start
        } catch (error) {
            console.log('Play button not found, continuing anyway...');
        }

        // Make browser window full screen using xdotool (after play is clicked)
        // xdotool simulates F11 keypress at system level, bypassing Fn key requirements
        console.log('Making browser full screen with xdotool...');
        try {
            if (IS_DEBIAN) {
                // On Debian/Raspberry Pi, use xdotool to focus window and send F11 key
                // Try multiple methods to find the browser window
                console.log('Finding browser window...');

                let windowId = null;

                // Try multiple search strategies
                const searchStrategies = [
                    'xdotool search --class chromium | head -1',
                    'xdotool search --class Chromium | head -1',
                    'xdotool search --classname chromium | head -1',
                    'xdotool search --name "AccuWeather" | head -1',
                    'xdotool search --name "Chromium" | head -1',
                    'xdotool getactivewindow'  // Get currently active window as fallback
                ];

                for (const strategy of searchStrategies) {
                    try {
                        console.log(`Trying: ${strategy}`);
                        const { stdout } = await execPromise(strategy);
                        if (stdout && stdout.trim()) {
                            windowId = stdout.trim();
                            console.log(`Found window ID: ${windowId} using: ${strategy}`);
                            break;
                        }
                    } catch (err) {
                        // Try next strategy
                        continue;
                    }
                }

                if (windowId) {
                    // Focus the window
                    await execPromise(`xdotool windowactivate ${windowId}`);
                    console.log('Window activated');

                    // Wait a moment for window to focus
                    await page.waitForTimeout(500);

                    // Try F11 first
                    console.log('Attempting F11...');
                    await execPromise(`xdotool key --window ${windowId} F11`);
                    await page.waitForTimeout(1000);

                    // Try Fn+F11 combination (some keyboards require this)
                    console.log('Attempting Fn+F11...');
                    await execPromise(`xdotool key --window ${windowId} XF86Switch_VT_11`);
                    await page.waitForTimeout(1000);

                    // Try alternative Fn+F11 mapping
                    console.log('Attempting alternative Fn+F11...');
                    await execPromise(`xdotool key --window ${windowId} Super_L+F11`);

                    console.log('Fullscreen toggle attempts completed');
                } else {
                    console.log('Could not find browser window, trying generic keypresses to active window...');
                    await execPromise('xdotool key F11');
                    await page.waitForTimeout(1000);
                    await execPromise('xdotool key XF86Switch_VT_11');
                    await page.waitForTimeout(1000);
                    await execPromise('xdotool key Super_L+F11');
                }
            } else {
                // On macOS, use JavaScript fullscreen API
                await page.evaluate(() => {
                    if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen();
                    }
                });
                console.log('Fullscreen requested via JavaScript');
            }
        } catch (error) {
            console.log('Could not request fullscreen:', error.message);
            console.log('Continuing anyway...');
        }
        await page.waitForTimeout(5000); // Wait 5 seconds for fullscreen transition

        // Run for 10 minutes
        console.log('');
        console.log(`Running weather radar for ${RUN_DURATION_MS / 60000} minutes...`);
        console.log(`Will restart at: ${new Date(Date.now() + RUN_DURATION_MS).toLocaleTimeString()}`);
        console.log('');

        await page.waitForTimeout(RUN_DURATION_MS);

        // Close the browser
        console.log('Closing browser...');
        await browser.close();

        console.log('');
        console.log('=================================');
        console.log('Weather Watcher cycle complete!');
        console.log('=================================');
        console.log('');

    } catch (error) {
        console.error('Error occurred:', error.message);

        // Clean up
        if (page) await page.close().catch(() => {});
        if (context) await context.close().catch(() => {});
        if (browser) await browser.close().catch(() => {});

        throw error;
    }
}

async function main() {
    console.log('Weather Watcher - Starting continuous loop');
    console.log('Press Ctrl+C to stop');
    console.log('');

    // Run continuously
    while (true) {
        try {
            await runWeatherWatcher();

            // Brief pause before restarting
            console.log('Waiting 5 seconds before restart...');
            await new Promise(resolve => setTimeout(resolve, RESTART_DELAY_MS));

        } catch (error) {
            console.error('Error in weather watcher:', error);
            console.log('Waiting 30 seconds before retry...');
            await new Promise(resolve => setTimeout(resolve, ERROR_RETRY_DELAY_MS));
        }
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\nReceived SIGINT, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n\nReceived SIGTERM, shutting down gracefully...');
    process.exit(0);
});

// Start the application
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
