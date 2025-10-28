# Installing xdotool on Raspberry Pi

If the automatic installation fails, here are manual methods to install xdotool.

## Method 1: Standard Repository (Raspberry Pi OS)

```bash
sudo apt-get update
sudo apt-get install xdotool
```

## Method 2: Enable Additional Repositories

If xdotool is not found, you may need to enable additional repositories:

```bash
# For Raspberry Pi OS / Debian
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository universe
sudo apt-get update
sudo apt-get install xdotool
```

## Method 3: Install from Source

If package installation fails, compile from source:

```bash
# Install build dependencies
sudo apt-get install git gcc make libx11-dev libxtst-dev libxi-dev libxkbcommon-dev

# Clone xdotool repository
cd ~
git clone https://github.com/jordansissel/xdotool.git
cd xdotool

# Build and install
make
sudo make install

# Verify installation
xdotool --version
```

## Method 4: Check if Already Installed

xdotool might already be installed:

```bash
which xdotool
xdotool --version
```

## Verify Installation

After installation, test it:

```bash
# Should print the version
xdotool --version

# Test a simple command (should print window IDs)
xdotool search --name ""
```

## Alternative: Run Without xdotool

If you can't install xdotool, the weather-watcher script will still work, but fullscreen toggling via F11 won't be automated. You can:

1. **Manually press Fn+F11** on your keyboard after the browser opens
2. **Use browser launch flags** - The script already uses `--start-fullscreen` which should start the browser in fullscreen mode

## Troubleshooting

### "Unable to locate package xdotool"

This usually means:
1. Your package lists are out of date: `sudo apt-get update`
2. The package is in a repository that's not enabled
3. You're on a minimal OS installation

### "Package has no installation candidate"

Try:
```bash
sudo apt-get update --fix-missing
sudo apt-get install xdotool
```

### Still Not Working?

The weather-watcher will still function without xdotool. The browser will launch with `--start-fullscreen` flag, which should provide a fullscreen experience even without xdotool.

## Contact

If you continue to have issues, please open an issue on GitHub with:
- Your Raspberry Pi model
- OS version: `cat /etc/os-release`
- Error messages from installation attempts

