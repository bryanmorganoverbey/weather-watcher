# Quick Start Guide

## macOS Development (Local Debugging)

Perfect for testing and debugging on your Mac!

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install chromium

# 3. Create .env file
cp env.example .env

# 4. Verify .env has PLATFORM=macos
cat .env

# 5. Run the weather watcher
npm start
```

The browser will open in a native window on your Mac, allowing you to see and debug everything.

---

## Docker/Debian (Production)

Perfect for running on servers or in containers!

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The container automatically configures itself for Debian with a virtual display.

---

## Platform Switching

The application automatically detects the platform from the `.env` file:

- **macOS Mode**: Browser opens in native window, perfect for debugging
- **Debian Mode**: Browser runs in Xvfb virtual display, perfect for servers

To switch platforms, just change the `PLATFORM` variable in your `.env` file:

```bash
# For macOS
PLATFORM=macos

# For Debian/Docker
PLATFORM=debian
```

---

## Debugging Tips

### View Browser in Docker

1. Uncomment the VNC port in `docker-compose.yml`:
```yaml
ports:
  - "5900:5900"
```

2. Rebuild and run:
```bash
docker-compose up --build
```

3. Connect with any VNC viewer to `localhost:5900`

### Check Platform Configuration

The script logs the platform configuration when it starts:
```
=================================
Platform Configuration
=================================
Platform: macos
Running on macOS: true
Running on Debian: false
```

### Common Issues

- **Browser won't open on Mac**: Install Playwright browsers with `npx playwright install chromium`
- **Missing .env file**: Copy from example with `cp env.example .env`
- **Docker container fails**: Check logs with `docker-compose logs`

