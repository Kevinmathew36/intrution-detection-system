module.exports = {
  host: {
    pollIntervalMs: 5000,
    whitelistNames: [ 'System', 'Idle', 'svchost.exe', 'explorer.exe' ],
    connThresholdPerProcess: 50
  },
  network: {
    synFloodThreshold: 200,
    windowMs: 10000
  }
};