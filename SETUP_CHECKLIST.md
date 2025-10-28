# Raspberry Pi Setup Checklist

Use this checklist to verify your Raspberry Pi setup is complete and working.

## ✅ Pre-Installation Checklist

- [ ] Raspberry Pi is powered on
- [ ] Display is connected via HDMI
- [ ] Internet connection is active
- [ ] Raspberry Pi OS is installed and updated
- [ ] You have terminal access (keyboard or SSH)

## ✅ Installation Steps

```bash
# 1. Clone the repository
cd ~
git clone <repository-url> weather-watcher
cd weather-watcher

# 2. Run installation script
chmod +x install.sh
./install.sh
```

### Verify Installation:

- [ ] Node.js installed (check: `node --version`)
- [ ] npm installed (check: `npm --version`)
- [ ] Project dependencies installed (check: `ls node_modules/`)
- [ ] Playwright installed (check: `npx playwright --version`)
- [ ] `.env` file created (check: `cat .env`)
- [ ] `.env` has `PLATFORM=debian`
- [ ] `.env` has `DISPLAY=:0`

## ✅ First Run Test

```bash
npm start
```

### Expected Behavior:

- [ ] Browser window opens in fullscreen kiosk mode
- [ ] AccuWeather radar page loads
- [ ] Privacy banner is closed automatically (if present)
- [ ] Radar map is visible
- [ ] Radar fullscreen button is clicked
- [ ] Radar play button is clicked
- [ ] Radar animation starts playing
- [ ] Console shows: "Platform: debian"
- [ ] Console shows: "Running on Debian: true"
- [ ] Script runs for 10 minutes then restarts

### Stop the test:
- [ ] Press `Ctrl+C` to stop
- [ ] Browser closes gracefully

## ✅ Auto-Start Setup (Optional)

### Option A: Systemd Service

```bash
# 1. Edit service file if needed
nano weather-watcher.service

# 2. Install service
sudo cp weather-watcher.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable weather-watcher.service
sudo systemctl start weather-watcher.service

# 3. Check status
sudo systemctl status weather-watcher.service
```

**Verify:**
- [ ] Service status shows "active (running)"
- [ ] Browser opens automatically
- [ ] Radar is displaying

### Option B: Autostart (Alternative)

```bash
mkdir -p ~/.config/autostart
cat > ~/.config/autostart/weather-watcher.desktop << 'EOF'
[Desktop Entry]
Type=Application
Name=Weather Watcher
Exec=/home/pi/weather-watcher/start-weather-watcher.sh
Terminal=false
EOF
chmod +x ~/weather-watcher/start-weather-watcher.sh
```

**Verify:**
- [ ] Desktop entry created
- [ ] Startup script is executable
- [ ] Reboot and verify auto-start: `sudo reboot`

## ✅ Final Verification

After reboot (if using auto-start):

- [ ] System boots to desktop
- [ ] Browser opens automatically in fullscreen
- [ ] Radar displays and animates
- [ ] No errors in logs: `sudo journalctl -u weather-watcher.service -n 50`

## ✅ Optional Enhancements

### Hide Mouse Cursor
```bash
sudo apt-get install unclutter
# Add to autostart or systemd service
```

### Disable Screen Blanking
```bash
xset s off
xset -dpms
xset s noblank
```

### Increase GPU Memory (if needed)
```bash
sudo raspi-config
# Advanced Options > Memory Split > Set to 128MB or higher
```

## 🎉 Setup Complete!

Your Raspberry Pi weather display is now ready!

### Quick Commands:

**Start manually:**
```bash
cd ~/weather-watcher
npm start
```

**Check service status:**
```bash
sudo systemctl status weather-watcher.service
```

**View logs:**
```bash
sudo journalctl -u weather-watcher.service -f
```

**Stop service:**
```bash
sudo systemctl stop weather-watcher.service
```

**Restart service:**
```bash
sudo systemctl restart weather-watcher.service
```

## Troubleshooting

If something doesn't work, see:
- [RASPBERRY_PI_SETUP.md](RASPBERRY_PI_SETUP.md) - Complete setup guide
- [README.md](README.md) - General troubleshooting
- [QUICKSTART.md](QUICKSTART.md) - Quick reference

## Support

For issues, check the troubleshooting sections or open an issue on GitHub.

