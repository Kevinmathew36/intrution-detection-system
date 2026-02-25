const si = require('systeminformation');
let timer = null;
let baseline = new Set();

function start(rules, onAlert) {
  initBaseline().then(() => {
    timer = setInterval(() => check(rules, onAlert), rules.host.pollIntervalMs || 5000);
  });
}

async function initBaseline() {
  try {
    const procs = await si.processes();
    procs.list.forEach(p => baseline.add(p.name));
  } catch (e) {
  }
}

async function check(rules, onAlert) {
  try {
    const procs = await si.processes();
    const conns = await si.networkConnections();
    const currentNames = new Set(procs.list.map(p => p.name));

    for (const p of procs.list) {
      if (!baseline.has(p.name) && !rules.host.whitelistNames.includes(p.name)) {
        onAlert('NewProcess', { name: p.name, pid: p.pid });
        baseline.add(p.name);
      }
    }

    const connCountByPid = {};
    for (const c of conns) {
      const pid = c.pid || 0;
      connCountByPid[pid] = (connCountByPid[pid] || 0) + 1;
    }

    for (const p of procs.list) {
      const count = connCountByPid[p.pid] || 0;
      if (count >= (rules.host.connThresholdPerProcess || 20)) {
        onAlert('HighConnPerProcess', { name: p.name, pid: p.pid, connections: count });
      }
    }
  } catch (e) {
  }
}

function stop() {
  if (timer) clearInterval(timer);
}

module.exports = { start, stop };
