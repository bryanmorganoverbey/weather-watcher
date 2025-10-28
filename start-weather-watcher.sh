#!/bin/bash

# Weather Watcher Startup Script for Raspberry Pi
# This script can be used to start the weather watcher on boot

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to the script directory
cd "$SCRIPT_DIR"

# Set display (for Raspberry Pi with physical display)
export DISPLAY=:0

# Log file location
LOG_FILE="$SCRIPT_DIR/weather-watcher.log"

# Start the weather watcher
echo "Starting Weather Watcher at $(date)" >> "$LOG_FILE"
npm start >> "$LOG_FILE" 2>&1

