# Installation Guide

This guide provides detailed instructions for installing and running xRay Logs on different operating systems.

## macOS

### Installation Steps

1. Download the appropriate version for your Mac:
   - For Apple Silicon (M1/M2): [Download ARM64 Version](https://github.com/XRay-Log/xRay/releases/latest/download/xRay_aarch64.dmg)
   - For Intel-based Mac: [Download x64 Version](https://github.com/XRay-Log/xRay/releases/latest/download/xRay_x64.dmg)

2. Open the downloaded .dmg file
3. Drag the xRay app to your Applications folder

### Running Unsigned Application

Since the application is not signed with an Apple Developer Certificate, macOS may prevent it from running. Here's how to run the application:

1. When you first try to open the application, macOS might show a warning saying "cannot be opened because the developer cannot be verified."
2. To open the app:
   - Right-click (or Control-click) on the app in Finder
   - Select "Open" from the context menu
   - Click "Open" in the dialog box that appears
3. Alternative method using Terminal:
   ```bash
   xattr -cr /Applications/xRay.app
   ```
   Then try opening the app again.

> **Note**: You only need to do this once. After allowing the app to run for the first time, you can open it normally.

## Windows

### Installation Steps

1. Download the latest version for Windows
2. Run the installer (.exe file)
3. Follow the installation wizard instructions

### Running Unsigned Application

When running the application on Windows, you might see a "Windows protected your PC" message because the app isn't signed with a Microsoft certificate. Here's how to run it:

1. When the SmartScreen warning appears:
   - Click "More info"
   - Click "Run anyway"

2. Alternative method:
   - Right-click the .exe file
   - Select "Properties"
   - Check the box next to "Unblock" under Security
   - Click "Apply" and "OK"

> **Note**: This is a one-time process. After allowing the app once, you can open it normally in the future.

## Troubleshooting

If you encounter any issues during installation:

1. Make sure you have downloaded the correct version for your operating system
2. Check if you have sufficient permissions to install applications
3. Temporarily disable antivirus software if it's blocking the installation
4. For additional help, please create an issue on our [GitHub Issues](https://github.com/XRay-Log/xRay/issues) page
