const Cap = require('cap').Cap;
const decoders = require('cap').decoders;
const PROTOCOL = decoders.PROTOCOL;
let c = null;
let synCounts = {};
let windowTimer = null;

function start(rules, onAlert) {
  try {
    const devices = Cap.deviceList();
    let device = null;
    for (const d of devices) {
      if (!d.addresses || d.addresses.length === 0) continue;
      const hasLoop = d.addresses.some(a => a.addr && a.addr.indexOf('127.') === 0);
      if (!hasLoop) { device = d.name; break; }
    }
    if (!device) device = devices[0] && devices[0].name;
    if (!device) return;

    c = new Cap();
    const filter = 'tcp';
    const bufSize = 10 * 1024 * 1024;
    const buffer = Buffer.alloc(65535);
    const linkType = c.open(device, filter, bufSize, buffer);

    c.setMinBytes && c.setMinBytes(0);

    c.on('packet', function(nbytes, trunc) {
      try {
        if (linkType === 'ETHERNET') {
          const ret = decoders.Ethernet(buffer);
          if (ret.info.type === PROTOCOL.ETHERNET.IPV4) {
            const ip = decoders.IPV4(buffer, ret.offset);
            if (ip.protocol === PROTOCOL.IP.TCP) {
              const tcp = decoders.TCP(buffer, ip.offset);
              const flags = tcp.info.flags;
              const syn = (flags & 0x02) !== 0;
              if (syn) {
                const src = ip.info.srcaddr;
                synCounts[src] = (synCounts[src] || 0) + 1;
                if (synCounts[src] > (rules.network.synFloodThreshold || 100)) {
                  onAlert('SynFlood', { src, count: synCounts[src] });
                  synCounts[src] = 0;
                }
              }
            }
          }
        }
      } catch (e) {
      }
    });

    windowTimer = setInterval(() => { synCounts = {}; }, rules.network.windowMs || 10000);
  } catch (e) {
  }
}

function stop() {
  if (c) { try { c.close(); } catch (e) {} }
  if (windowTimer) clearInterval(windowTimer);
}

module.exports = { start, stop };
