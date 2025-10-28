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

# Install system dependencies
echo "Step 1: Installing system dependencies..."
echo ""
sudo apt-get update

# Try to install xdotool
echo "Attempting to install xdotool..."
if sudo apt-get install -y xdotool 2>/dev/null; then
    echo "xdotool installed successfully"
else
    echo "Warning: Could not install xdotool from default repositories"
    echo "Trying to install from universe repository..."

    # Try adding universe repository (for Ubuntu/Debian)
    sudo add-apt-repository universe 2>/dev/null || true
    sudo apt-get update

    if sudo apt-get install -y xdotool 2>/dev/null; then
        echo "xdotool installed successfully from universe"
    else
        echo "Warning: xdotool could not be installed"
        echo "You may need to install it manually later:"
        echo "  sudo apt-get install xdotool"
        echo ""
        echo "Continuing with installation..."
    fi
fi

# Install curl if not present
sudo apt-get install -y curl
echo ""

# Install Node.js using NodeSource repository
echo "Step 2: Installing Node.js (latest LTS version)..."
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

# Install project dependencies
echo "Step 3: Installing project dependencies..."
echo ""
cd "$(dirname "$0")"
npm install

# Install Playwright browsers
echo ""
echo "Step 4: Installing Playwright browsers..."
echo "Note: This may take several minutes..."
echo ""
npx playwright install chromium
npx playwright install-deps chromium

# Create .env file for Raspberry Pi
echo ""
echo "Step 5: Creating environment configuration..."
echo ""
if [ ! -f .env ]; then
    echo "Creating .env file for Raspberry Pi..."
    cat > .env << 'EOF'
# Platform Configuration
# Set to 'debian' for Raspberry Pi
PLATFORM=debian

# Display Configuration
DISPLAY=:0
EOF
    echo ".env file created successfully"
else
    echo ".env file already exists, skipping..."
fi

echo ""
echo "==================================="
echo "Installation Complete!"
echo "==================================="
echo ""
echo "You can now run the weather watcher:"
echo "  npm start"
echo ""
echo "Or run directly:"
echo "  node weather-watcher.js"
echo ""
