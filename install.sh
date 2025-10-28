#!/bin/bash

# Weather Watcher Installation Script
# This script installs Node.js and Playwright on a Raspberry Pi Linux system

set -e  # Exit on any error

echo "==================================="
echo "Weather Watcher Installation Script"
echo "==================================="
echo ""

# Check if running on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo "Warning: This script is designed for Linux systems (Raspberry Pi)"
fi

# Install Node.js using NodeSource repository
echo "Step 1: Installing Node.js (latest LTS version)..."
echo ""

# Remove old NodeSource repository if it exists
if [ -f /etc/apt/sources.list.d/nodesource.list ]; then
    echo "Removing old NodeSource repository..."
    sudo rm -f /etc/apt/sources.list.d/nodesource.list
fi

# Download and run NodeSource setup script for Node.js LTS
echo "Adding NodeSource repository for Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -

# Install Node.js
echo "Installing Node.js..."
sudo apt-get install -y nodejs

# Verify Node.js installation
echo ""
echo "Node.js version installed:"
node --version
echo "npm version installed:"
npm --version
echo ""

# Install Playwright globally
echo "Step 2: Installing Playwright globally..."
echo ""
sudo npm install -g playwright

# Install Playwright browsers
echo ""
echo "Step 3: Installing Playwright browsers..."
echo "Note: This may take several minutes..."
echo ""
sudo npx playwright install chromium
sudo npx playwright install-deps chromium

echo ""
echo "==================================="
echo "Installation Complete!"
echo "==================================="
echo ""
echo "You can now run the weather watcher script:"
echo "  node weather-watcher.js"
echo ""
