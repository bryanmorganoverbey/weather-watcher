# Raspberry Pi Setup Guide

Complete guide for setting up Weather Watcher on a Raspberry Pi with automatic startup.

## Prerequisites

- Raspberry Pi (any model with display output)
- Raspberry Pi OS (formerly Raspbian) installed
- Physical display connected via HDMI
- Internet connection
- Keyboard for initial setup (optional after setup)

## Quick Setup

### 1. Clone and Install

```bash
# Clone the repository
cd ~
git clone <repository-url> weather-watcher
cd weather-watcher

# Run the installation script
chmod +x install.sh
./install.sh
```

The installation script will:
- Install Node.js LTS
- Install all dependencies (playwright, dotenv)
- Install Chromium browser
- Create `.env` file with `PLATFORM=debian`

### 2. Test Run

```bash
npm start
```

The browser should open in fullscreen kiosk mode and display the weather radar.
Press `Ctrl+C` to stop.

## Auto-Start on Boot (Optional)

### Option 1: Using systemd (Recommended)

1. **Edit the service file** to match your setup:

```bash
nano weather-watcher.service
```

Update these lines if needed:
- `User=pi` (change if using different user)
- `WorkingDirectory=/home/pi/weather-watcher` (change to your path)

2. **Install the service**:

```bash
# Copy service file to systemd
sudo cp weather-watcher.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable the service to start on boot
sudo systemctl enable weather-watcher.service

# Start the service now
sudo systemctl start weather-watcher.service
```

3. **Check status**:

```bash
sudo systemctl status weather-watcher.service
```

4. **View logs**:

```bash
sudo journalctl -u weather-watcher.service -f
```

5. **Stop the service**:

```bash
sudo systemctl stop weather-watcher.service
```

6. **Disable auto-start**:

```bash
sudo systemctl disable weather-watcher.service
```

### Option 2: Using Autostart (Simple)

1. **Create autostart directory** (if it doesn't exist):

```bash
mkdir -p ~/.config/autostart
```

2. **Create desktop entry**:

```bash
cat > ~/.config/autostart/weather-watcher.desktop << 'EOF'
[Desktop Entry]
Type=Application
Name=Weather Watcher
Exec=/home/pi/weather-watcher/start-weather-watcher.sh
Terminal=false
EOF
```

3. **Make startup script executable**:

```bash
chmod +x ~/weather-watcher/start-weather-watcher.sh
```

4. **Reboot to test**:

```bash
sudo reboot
```

## Configuration

### Change Weather Location

Edit `weather-watcher.js` and change the `WEATHER_URL`:

```javascript
const WEATHER_URL = 'https://www.accuweather.com/en/us/YOUR-CITY/...';
```

### Change Display Duration

Edit `weather-watcher.js` and change the `RUN_DURATION_MS`:

```javascript
const RUN_DURATION_MS = 10 * 60 * 1000; // 10 minutes
```

### Disable Auto-Restart

If you want the script to run once and exit (instead of continuous loop), comment out the `main()` function and call `runWeatherWatcher()` directly:

```javascript
// main().catch(error => {
//     console.error('Fatal error:', error);
//     process.exit(1);
// });

runWeatherWatcher().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
```

## Troubleshooting

### Browser doesn't open

1. **Check display is set correctly**:
```bash
echo $DISPLAY
# Should output: :0
```

2. **Check .env file**:
```bash
cat .env
# Should have: PLATFORM=debian and DISPLAY=:0
```

3. **Test X11 access**:
```bash
xhost +
```

### Permission errors

Run with proper permissions:
```bash
xhost +SI:localuser:pi
```

### Browser crashes or freezes

Raspberry Pi may need more memory allocated to GPU:
```bash
sudo raspi-config
# Go to: Advanced Options > Memory Split
# Set to at least 128MB
```

### Service won't start

Check logs:
```bash
sudo journalctl -u weather-watcher.service -n 50
```

Check permissions:
```bash
ls -la /home/pi/weather-watcher
```

### Screen blanking/sleep

Disable screen blanking:
```bash
# Edit lightdm config
sudo nano /etc/lightdm/lightdm.conf

# Add under [Seat:*]:
xserver-command=X -s 0 -dpms
```

Or use xset:
```bash
xset s off
xset -dpms
xset s noblank
```

## Updating

To update the weather watcher:

```bash
cd ~/weather-watcher
git pull
npm install
sudo systemctl restart weather-watcher.service
```

## Uninstalling

### Remove service:
```bash
sudo systemctl stop weather-watcher.service
sudo systemctl disable weather-watcher.service
sudo rm /etc/systemd/system/weather-watcher.service
sudo systemctl daemon-reload
```

### Remove autostart:
```bash
rm ~/.config/autostart/weather-watcher.desktop
```

### Remove files:
```bash
cd ~
rm -rf weather-watcher
```

## Tips

- **Rotate Display**: Use `display_rotate=1` in `/boot/config.txt` for portrait mode
- **Hide Mouse Cursor**: Install `unclutter` package: `sudo apt-get install unclutter`
- **Prevent Sleep**: Disable screen saver in Raspberry Pi settings
- **Remote Access**: Use VNC to access the Pi remotely for configuration

## Support

For issues or questions, check the main README.md or open an issue on GitHub.

