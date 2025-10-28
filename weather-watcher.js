const { chromium } = require('playwright');

/**
 * Weather Watcher - AccuWeather Radar Automation
 * 
 * This script automates viewing the AccuWeather radar for Nashville, TN:
 * - Opens browser to the weather radar page
 * - Makes the browser full screen
 * - Clicks the full-screen button on the radar UI
 * - Starts the radar animation
 * - Runs for 10 minutes then closes and restarts
 */

const WEATHER_URL = 'https://www.accuweather.com/en/us/nashville/37243/weather-radar/351090';
const RUN_DURATION_MS = 10 * 60 * 1000; // 10 minutes in milliseconds

async function runWeatherWatcher() {
    let browser;
    let context;
    let page;

    try {
        console.log('=================================');
        console.log('Starting Weather Watcher...');
        console.log('=================================');
        console.log('');

        // Launch browser
        console.log('Launching browser...');
        browser = await chromium.launch({
            headless: false, // Run in headed mode to display the UI
            args: [
                '--start-fullscreen',
                '--disable-infobars',
                '--no-default-browser-check'
            ]
        });

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
            timeout: 60000 
        });

        // Wait for the page to load
        console.log('Waiting for page to load...');
        await page.waitForTimeout(5000);

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
                    await page.waitForTimeout(1000);
                    break;
                }
            }
        } catch (error) {
            // Ignore errors if banner doesn't exist
            console.log('No privacy banner to close');
        }

        // Make browser window full screen (F11 key)
        console.log('Making browser full screen...');
        await page.keyboard.press('F11');
        await page.waitForTimeout(2000);

        // Find and click the full-screen button in the radar UI
        console.log('Looking for full-screen button in radar UI...');
        
        // Wait for radar/map to be visible
        await page.waitForTimeout(3000);

        // Try multiple possible selectors for full-screen button
        const fullscreenSelectors = [
            'button[aria-label="Full screen"]',
            'button[title="Full screen"]',
            'button[aria-label="Fullscreen"]',
            'button[title="Fullscreen"]',
            '.fullscreen-button',
            '[class*="fullscreen"]',
            '[data-testid*="fullscreen"]'
        ];

        let fullscreenClicked = false;
        for (const selector of fullscreenSelectors) {
            try {
                const button = await page.$(selector);
                if (button && await button.isVisible()) {
                    console.log(`Clicking full-screen button: ${selector}`);
                    await button.click();
                    fullscreenClicked = true;
                    await page.waitForTimeout(2000);
                    break;
                }
            } catch (error) {
                // Try next selector
                continue;
            }
        }

        if (!fullscreenClicked) {
            console.log('Full-screen button not found, continuing anyway...');
        }

        // Find and click the play button
        console.log('Looking for play button...');
        await page.waitForTimeout(2000);

        const playSelectors = [
            'button[aria-label="Play"]',
            'button[title="Play"]',
            'button[aria-label="Play animation"]',
            'button[title="Play animation"]',
            '.play-button',
            '[class*="play"]',
            '[data-testid*="play"]',
            'button:has-text("Play")'
        ];

        let playClicked = false;
        for (const selector of playSelectors) {
            try {
                const button = await page.$(selector);
                if (button && await button.isVisible()) {
                    console.log(`Clicking play button: ${selector}`);
                    await button.click();
                    playClicked = true;
                    await page.waitForTimeout(1000);
                    break;
                }
            } catch (error) {
                // Try next selector
                continue;
            }
        }

        if (!playClicked) {
            console.log('Play button not found, continuing anyway...');
        }

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
            await new Promise(resolve => setTimeout(resolve, 5000));
            
        } catch (error) {
            console.error('Error in weather watcher:', error);
            console.log('Waiting 30 seconds before retry...');
            await new Promise(resolve => setTimeout(resolve, 30000));
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
