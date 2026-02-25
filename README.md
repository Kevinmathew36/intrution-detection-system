# Intrusion Detection System

A Node.js-based intrusion detection system that monitors and detects suspicious network activity and system behavior.

## Features

- **Network Detection** - Monitors network traffic patterns for anomalous behavior
- **System Monitoring** - Tracks system activities and resource usage
- **Real-time Detection** - Continuously analyzes activity streams for threats

## Project Structure

```
intrution-detection-system/
├── detection.js           # Core detection logic
├── detection_network.js   # Network-based intrusion detection
├── monitor.js             # System and network monitoring
└── README.md              # Project documentation
```

## Installation

```bash
npm install
```

## Usage

```bash
node detection.js
```

## How It Works

### Detection Module (`detection.js`)
Implements core detection algorithms and threat identification logic.

### Network Detection (`detection_network.js`)
Analyzes network packets and traffic patterns to identify suspicious network-based attacks.

### Monitoring (`monitor.js`)
Continuously monitors system and network activity, forwarding suspicious events to detection modules.

## Requirements

- Node.js (v12.0.0 or higher)
- npm or yarn

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available without a licence .

## Support

For issues or questions, please open an issue in the repository.
