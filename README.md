# weather-watcher

A repo of bash scripts and node scripts that install and track weather using browser automation.

## Overview

This project provides automated weather radar viewing for Nashville, TN using Playwright browser automation. It's designed to run on Raspberry Pi Linux systems and continuously displays the AccuWeather radar in full-screen mode.

## Features

- Automated Node.js installation on Raspberry Pi
- Playwright browser automation setup
- Continuous weather radar viewing
- Automatic full-screen mode
- 10-minute viewing cycles with automatic restart
- Graceful error handling and recovery

## Installation

### Quick Start

Run the installation script to set up Node.js and Playwright:

```bash
chmod +x install.sh
./install.sh
```

The installation script will:
1. Install the latest LTS version of Node.js
2. Install Playwright globally
3. Download and install Chromium browser
4. Install all necessary system dependencies

### Manual Installation

If you prefer to install manually:

```bash
# Install Node.js (LTS version)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Playwright globally
sudo npm install -g playwright

# Install Playwright browsers and dependencies
sudo npx playwright install chromium
sudo npx playwright install-deps chromium
```

## Usage

### Running the Weather Watcher

Start the weather watcher automation:

```bash
node weather-watcher.js
```

Or use npm:

```bash
npm start
```

### What It Does

The weather watcher will:
1. Launch a Chromium browser window
2. Navigate to AccuWeather's Nashville weather radar page
3. Make the browser full-screen
4. Attempt to click the full-screen button in the radar UI
5. Start the radar animation by clicking the play button
6. Display the radar for 10 minutes
7. Close the browser and automatically restart

### Stopping the Script

Press `Ctrl+C` to gracefully stop the weather watcher.

## Configuration

You can modify the following constants in `weather-watcher.js`:

- `WEATHER_URL`: Change to a different AccuWeather location
- `RUN_DURATION_MS`: Adjust the viewing duration (default: 10 minutes)

## Requirements

- Raspberry Pi or Linux system
- Internet connection
- Display for viewing the weather radar

## Files

- `install.sh` - Installation script for Node.js and Playwright
- `weather-watcher.js` - Main Playwright automation script
- `package.json` - Node.js project configuration

## Troubleshooting

### Browser doesn't launch
- Ensure you have a display connected and X server running
- Try running with `DISPLAY=:0 node weather-watcher.js`

### Full-screen or play buttons not found
- The website layout may have changed
- The script includes multiple selector strategies and will continue running even if some elements aren't found

### Installation fails
- Ensure you have sudo privileges
- Check your internet connection
- Verify you're running on a Debian-based Linux system

## License

ISC
