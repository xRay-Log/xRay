# xRay

A modern, high-performance log management and comparison application built with React and Tauri.

> **⚠️ Beta Notice**: xRay is currently in beta. While it's stable for daily use, you may encounter occasional bugs. Please report any issues you find on our [GitHub Issues](https://github.com/XRay-Log/xRay/issues) page.

![XRay](https://github.com/xRay-Log/xRay/blob/main/assets/featured.jpg?raw=true)

## Download

<div align="center">

[![Download for macOS (Apple Silicon)](https://img.shields.io/badge/Download_for_macOS-M1/M2-000000?style=for-the-badge&logo=apple&logoColor=white)](https://github.com/XRay-Log/xRay/releases/latest/download/xRay_aarch64.dmg)
[![Download for macOS (Intel)](https://img.shields.io/badge/Download_for_macOS-Intel-000000?style=for-the-badge&logo=apple&logoColor=white)](https://github.com/XRay-Log/xRay/releases/latest/download/xRay_x64.dmg)
[![Download for Windows](https://img.shields.io/badge/Download_for_Windows-0078D4?style=for-the-badge&logo=windows11&logoColor=white)](https://github.com/XRay-Log/xRay/releases/latest/download/xRay_x64.msi)
[![Download for Linux](https://img.shields.io/badge/Download_for_Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)](https://github.com/XRay-Log/xRay/releases/latest/download/xRay.AppImage)

</div>

> **Note**: For detailed installation instructions and troubleshooting, please see our [Installation Guide](INSTALL.md).

## Features

- 🚀 Real-time log monitoring
- 🔍 Advanced log filtering and search
- 📊 Log level categorization (Error, Warning, Info, Debug)
- 🔄 Log comparison functionality
- 🔖 Bookmark important logs
- 🌓 Dark/Light theme support
- 🗂️ Project-based log organization
- 💾 Local storage with IndexedDB
- ⚡ High-performance rendering
- 🎯 Cross-platform support

## SDKs

<div align="center">

| Language | Latest Version | Documentation |
|----------|---------------|---------------|
| <img src="https://raw.githubusercontent.com/github/explore/56a826d05cf762b2b50ecbe7d492a839b04f3fbf/topics/laravel/laravel.png" width="24"> Laravel | [![Latest Version on Packagist](https://img.shields.io/packagist/v/xray-log/laravel.svg?style=flat-square)](https://packagist.org/packages/xray-log/laravel) | [Documentation](https://github.com/xRay-Log/laravel#readme) |
| <img src="https://raw.githubusercontent.com/github/explore/ccc16358ac4530c6a69b1b80c7223cd2744dea83/topics/php/php.png" width="24"> PHP | [![Latest Version on Packagist](https://img.shields.io/packagist/v/xray-log/php-sdk.svg?style=flat-square)](https://packagist.org/packages/xray-log/php-sdk) | [Documentation](https://github.com/xRay-Log/php-sdk#readme) |
| <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/javascript/javascript.png" width="24"> JavaScript | [![npm version](https://badge.fury.io/js/@xray-log%2Fjavascript-sdk.svg)](https://www.npmjs.com/package/@xray-log/javascript-sdk) | [Documentation](https://github.com/xRay-Log/javascript-sdk#readme) |

</div>

## Development

1. Clone the repository:
```bash
git clone https://github.com/XRay-Log/xRay.git
cd xRay
```

2. Install dependencies:
```bash
yarn install
```

3. Start the development server:
```bash
yarn tauri dev
```

### Prerequisites

- Node.js (v16 or higher)
- Rust (latest stable)
- Tauri CLI
- Yarn package manager

### Example Usage

Send logs to xRay using curl:
```bash
curl -s -L -X POST 'http://localhost:44827/receive' \
  -H 'Content-Type: application/json' \
  -d '{
    "level": "INFO",
    "payload": "{\"email\":\"muhammetuss@gmail.com\"}",
    "trace": "null",
    "project": "Users Service"
}'
```

## Features in Detail

- **Log Monitoring**: View and analyze logs in real-time with automatic level-based coloring
- **Smart Filtering**: Filter logs by level, project, or use bookmarks for quick access
- **Compare Mode**: Compare any two logs side by side
- **Theme Options**: Switch between dark and light themes based on your preference

## Contributing

Please see our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
