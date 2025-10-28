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

### Platform Configuration

This project supports both macOS (for local development/debugging) and Debian (for production/Docker deployment). The platform is configured via environment variables using a `.env` file.

**For macOS Development:**
1. Copy the example environment file:
```bash
cp env.example .env
```

2. Ensure the `.env` file has `PLATFORM=macos`:
```bash
PLATFORM=macos
```

**For Docker/Debian:**
The Docker container automatically sets `PLATFORM=debian`. No manual configuration needed.

### Quick Start (macOS)

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install chromium
```

3. Run the weather watcher:
```bash
npm start
```

### Quick Start (Raspberry Pi or Linux)

Simply clone the repo and run the installation script:

```bash
# Clone the repository
git clone <repository-url> weather-watcher
cd weather-watcher

# Run the installation script
chmod +x install.sh
./install.sh

# Start the weather watcher
npm start
```

The installation script will automatically:
1. Install system dependencies (xdotool for fullscreen control)
2. Install the latest LTS version of Node.js
3. Install project dependencies (including dotenv)
4. Install Playwright and Chromium browser
5. Install all necessary system dependencies
6. Create a `.env` file configured for Raspberry Pi (`PLATFORM=debian`)

**📖 For complete Raspberry Pi setup including auto-start on boot, see [RASPBERRY_PI_SETUP.md](RASPBERRY_PI_SETUP.md)**

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

## Docker Deployment

### Building and Running with Docker

Build and run the container using Docker Compose:

```bash
docker-compose up --build
```

Or use Docker directly:

```bash
docker build -t weather-watcher .
docker run --rm weather-watcher
```

### Docker Features

- **Platform**: Automatically configured for Debian
- **Virtual Display**: Uses Xvfb for headless browser automation
- **Auto-restart**: Container restarts automatically unless stopped
- **Resource Limits**: Configurable CPU and memory limits

### Debugging with VNC

To view the browser in action, uncomment the ports section in `docker-compose.yml`:

```yaml
ports:
  - "5900:5900"
```

Then connect with a VNC viewer to `localhost:5900`.

## Configuration

### Environment Variables

Configure the application using a `.env` file:

- `PLATFORM`: Set to `macos` or `debian` (default: `macos`)
- `DISPLAY`: X11 display for Debian/Docker (default: `:99`)

### Application Settings

You can modify the following constants in `weather-watcher.js`:

- `WEATHER_URL`: Change to a different AccuWeather location
- `RUN_DURATION_MS`: Adjust the viewing duration (default: 10 minutes)

## Requirements

### macOS Development
- macOS system
- Node.js (LTS version)
- Internet connection

### Raspberry Pi or Linux
- Raspberry Pi or Linux system
- Internet connection
- Display for viewing the weather radar

### Docker
- Docker and Docker Compose
- Internet connection

## Files

- `install.sh` - Installation script for Node.js and Playwright (Linux/Raspberry Pi)
- `weather-watcher.js` - Main Playwright automation script
- `package.json` - Node.js project configuration
- `start-weather-watcher.sh` - Startup script for Raspberry Pi
- `weather-watcher.service` - Systemd service file for auto-start
- `Dockerfile` - Docker container configuration for Debian
- `docker-compose.yml` - Docker Compose configuration
- `.dockerignore` - Docker build exclusions
- `env.example` - Example environment configuration
- `.env` - Local environment configuration (not in git)
- `RASPBERRY_PI_SETUP.md` - Complete Raspberry Pi setup guide
- `QUICKSTART.md` - Quick reference guide
- `CHANGES.md` - Change log

## Troubleshooting

### Platform Configuration Issues

**Wrong platform detected:**
- Check your `.env` file and ensure `PLATFORM` is set correctly
- For macOS: `PLATFORM=macos`
- For Debian/Docker: `PLATFORM=debian`

**Missing .env file on macOS:**
```bash
cp env.example .env
```

### Browser doesn't launch

**On macOS:**
- Ensure Playwright is installed: `npx playwright install chromium`
- Check that you have `PLATFORM=macos` in your `.env` file

**On Linux/Raspberry Pi:**
- Ensure you have a display connected and X server running
- Try running with `DISPLAY=:0 node weather-watcher.js`

**On Docker:**
- The container uses Xvfb virtual display automatically
- Check logs: `docker-compose logs -f`

### Full-screen or play buttons not found
- The website layout may have changed
- The script includes multiple selector strategies and will continue running even if some elements aren't found

### Installation fails
- Ensure you have sudo privileges
- Check your internet connection
- Verify you're running on a Debian-based Linux system

### Docker-specific issues

**Container won't start:**
- Check Docker logs: `docker-compose logs`
- Ensure ports aren't already in use
- Try rebuilding: `docker-compose up --build --force-recreate`

**Can't see the browser:**
- Uncomment VNC port in `docker-compose.yml`
- Connect with VNC viewer to `localhost:5900`

## License

ISC
