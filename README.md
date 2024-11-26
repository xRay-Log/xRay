# xRay Logs

A modern, high-performance log management and comparison application built with React and Tauri.

> **⚠️ Beta Notice**: xRay Logs is currently in beta. While it's stable for daily use, you may encounter occasional bugs. Please report any issues you find on our [GitHub Issues](https://github.com/XRay-Log/xRay/issues) page.

![XRay Logs Dark Mode](https://media.licdn.com/dms/image/v2/D4D22AQGMdhIcg6tm9g/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1732297848909?e=1735171200&v=beta&t=k_kukR_drXE7j-rg7v36_UzsoHi10FFZKnctdOVfItc)

## Download

<div align="center">

[![Download for macOS (Apple Silicon)](https://img.shields.io/badge/Download_for_macOS-M1/M2-000000?style=for-the-badge&logo=apple&logoColor=white)](https://github.com/XRay-Log/xRay/releases/latest/download/xRay_aarch64.dmg)
[![Download for macOS (Intel)](https://img.shields.io/badge/Download_for_macOS-Intel-000000?style=for-the-badge&logo=apple&logoColor=white)](https://github.com/XRay-Log/xRay/releases/latest/download/xRay_x64.dmg)
[![Download for Windows](https://img.shields.io/badge/Download_for_Windows-0078D4?style=for-the-badge&logo=windows11&logoColor=white)](https://github.com/XRay-Log/xRay/releases/latest/download/xRay_x64.msi)
[![Download for Linux](https://img.shields.io/badge/Download_for_Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)](https://github.com/XRay-Log/xRay/releases/latest/download/xRay.AppImage)

</div>

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

## Installation

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

## Development

### Prerequisites

- Node.js (v16 or higher)
- Rust (latest stable)
- Tauri CLI
- Yarn package manager

### Available Scripts

- `yarn tauri dev` - Start development server
- `yarn tauri build` - Build production version
- `yarn format` - Format code with Prettier

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