# Dockerfile for Weather Watcher - Debian System Emulation
# This creates a Debian-based container that can run the weather-watcher application

FROM debian:bookworm-slim

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive \
    NODE_VERSION=lts \
    DISPLAY=:99 \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=0 \
    PLATFORM=debian

# Update system and install essential packages
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    gnupg \
    ca-certificates \
    apt-transport-https \
    software-properties-common \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js LTS
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install Xvfb for virtual display (needed for headless browser automation)
RUN apt-get update && apt-get install -y \
    xvfb \
    x11vnc \
    fluxbox \
    && rm -rf /var/lib/apt/lists/*

# Create application directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Install Playwright browsers and system dependencies
RUN npx playwright install chromium \
    && npx playwright install-deps chromium

# Copy application files
COPY . .

# Create .env file for Docker environment
RUN echo "PLATFORM=debian" > .env && \
    echo "DISPLAY=:99" >> .env

# Create a startup script that runs Xvfb and the application
RUN echo '#!/bin/bash\n\
# Start Xvfb (virtual display)\n\
Xvfb :99 -screen 0 1920x1080x24 &\n\
XVFB_PID=$!\n\
\n\
# Wait for Xvfb to start\n\
sleep 2\n\
\n\
# Start the weather watcher\n\
node weather-watcher.js\n\
\n\
# Cleanup on exit\n\
kill $XVFB_PID\n\
' > /app/start.sh && chmod +x /app/start.sh

# Expose VNC port (optional, for debugging)
EXPOSE 5900

# Set the entrypoint
ENTRYPOINT ["/app/start.sh"]

# Health check (optional)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD pgrep -f "weather-watcher.js" > /dev/null || exit 1

# Labels
LABEL maintainer="Weather Watcher" \
      description="Debian-based container for running weather-watcher automation" \
      version="1.0.0"

