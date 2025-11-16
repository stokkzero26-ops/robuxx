// app.js
// RAT Simulator — UI-only (Edukasi)
// DISCLAIMER: Semua simulasi bersifat dummy. TIDAK melakukan koneksi jaringan atau eksekusi perintah.

(() => {
  // Utilities
  function qs(sel){ return document.querySelector(sel) }
  function qsa(sel){ return document.querySelectorAll(sel) }
  function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a }
  function now(){ return new Date().toLocaleTimeString() }

  // State (dummy)
  const state = {
    clients: [],
    logs: [],
    queue: []
  };

  // Elements
  const clientsListEl = qs('#clients-list');
  const statClients = qs('#stat-clients');
  const statOnline = qs('#stat-online');
  const logArea = qs('#log-area');
  const queueArea = qs('#queue-area');
  const modal = qs('#modal');
  const modalTitle = qs('#modal-title');
  const modalBody = qs('#modal-body');
  const modalClose = qs('#modal-close');

  // Navigation
  qsa('.nav-btn').forEach(btn=>{
    btn.addEventListener('click', e=>{
      qsa('.nav-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.dataset.view;
      qsa('.view').forEach(v=>v.classList.remove('active'));
      qs('#view-' + view).classList.add('active');
    })
  });

  // Create fake IP / OS
  function fakeIP(){ return `${randInt(10,250)}.${randInt(0,255)}.${randInt(0,255)}.${randInt(1,254)}` }
  const OSPOOL = ['Windows 10', 'Windows 11', 'Ubuntu 22.04', 'Debian 11', 'Android 12', 'MacOS 12'];

  // Spawn client (dummy)
  function spawnClient(customName) {
    const id = 'Client_' + String(state.clients.length + 1).padStart(3,'0');
    const client = {
      id,
      ip: fakeIP(),
      os: OSPOOL[randInt(0,OSPOOL.length-1)],
      online: true,
      ping: randInt(10,300)
    };
    state.clients.push(client);
    log(`${id} connected (handshake) — ${client.ip} • ${client.os}`);
    renderClients();
    updateStats();
  }

  // Render clients
  function renderClients(){
    clientsListEl.innerHTML = '';
    state.clients.forEach(c=>{
      const el = document.createElement('div');
      el.className = 'client-card';
      el.innerHTML = `<div>
          <strong>${c.id}</strong>
          <small>${c.os} • ${c.ip}</small>
        </div>
        <div class="client-actions">
          <button class="act" data-act="notify" data-id="${c.id}">Notify</button>
          <button class="act" data-act="info" data-id="${c.id}">SysInfo</button>
          <button class="act" data-act="screenshot" data-id="${c.id}">Screenshot</button>
        </div>`;
      clientsListEl.appendChild(el);
    });

    // attach action handlers
    qsa('.client-card .act').forEach(b=>{
      b.addEventListener('click', e=>{
        const act = b.dataset.act;
        const id = b.dataset.id;
        enqueueCommand(id, act);
      });
    });
  }

  // Logging (dummy)
  function log(msg){
    const entry = `[${now()}] ${msg}`;
    state.logs.unshift(entry);
    // keep only 500
    state.logs = state.logs.slice(0,500);
    logArea.innerText = state.logs.join('\n');
    const logsFull = qs('#logs-full');
    if(logsFull) logsFull.innerText = state.logs.join('\n');
  }

  // Stats
  function updateStats(){
    statClients.innerText = state.clients.length;
    const online = state.clients.filter(c=>c.online).length;
    statOnline.innerText = online;
  }

  // Command queue (visual only)
  function enqueueCommand(clientId, cmd){
    const id = `${clientId}-${Date.now()}`;
    const item = { id, clientId, cmd, ts: Date.now() };
    state.queue.push(item);
    log(`${clientId} queued command: ${cmd}`);
    renderQueue();
    // simulate server processing after short delay
    setTimeout(()=>processCommand(item), randInt(800,2000));
  }

  function renderQueue(){
    if(state.queue.length === 0){ queueArea.innerText = '— empty —'; return; }
    queueArea.innerHTML = state.queue.map(i => `${i.clientId} • ${i.cmd}`).join('<br>');
  }

  function processCommand(item){
    // Remove from queue (visual)
    state.queue = state.queue.filter(q=>q.id !== item.id);
    renderQueue();
    // perform simulated effect in UI (no real effect)
    simulatedEffect(item.clientId, item.cmd);
  }

  function simulatedEffect(clientId, cmd){
    switch(cmd){
      case 'notify':
        showModal(`${clientId} — Simulated Popup`, 'This is a fake notification triggered by the UI simulator.');
        log(`${clientId} -> simulated notify (popup shown locally)`);
        break;
      case 'info':
        showModal(`${clientId} — System Info (Dummy)`, `OS: ${OSPOOL[randInt(0,OSPOOL.length-1)]}\nIP: ${fakeIP()}\nUptime: ${randInt(1,99)} days`);
        log(`${clientId} -> simulated sysinfo returned`);
        break;
      case 'screenshot':
        showModal(`${clientId} — Screenshot (Simulated)`, 'Preview: [this is a placeholder image in real demo]');
        log(`${clientId} -> simulated screenshot captured (placeholder)`);
        break;
      default:
        log(`${clientId} -> unknown simulated command: ${cmd}`);
    }
  }

  // Modal
  function showModal(title, body){
    modalTitle.innerText = title;
    modalBody.innerText = body;
    modal.classList.remove('hidden');
  }
  modalClose.addEventListener('click', ()=>modal.classList.add('hidden'));

  // periodic heartbeat simulation (clients update)
  function heartbeatTick(){
    state.clients.forEach(c=>{
      // small chance to toggle online/offline (visual only)
      if(Math.random() < 0.03){
        c.online = !c.online;
        log(`${c.id} status changed -> ${c.online ? 'Online' : 'Offline'}`);
      } else {
        // update ping
        c.ping = Math.max(1, c.ping + randInt(-10,10));
      }
    });
    renderClients();
    updateStats();
  }

  // Auto spawn initially
  function initialBoot(){
    spawnClient('init1'); spawnClient('init2');
    // spawn new fake clients occasionally
    setInterval(()=>{ if(Math.random()<0.7) spawnClient(); }, 4000);
    // heartbeat
    setInterval(heartbeatTick, 2500);
  }

  // UI Controls
  qs('#spawn-client').addEventListener('click', ()=>spawnClient());
  qs('#clear-logs').addEventListener('click', ()=>{
    state.logs = []; logArea.innerText = ''; qs('#logs-full').innerText = '';
  });

  // Simple click handlers for top diagram animation (pure UI)
  const diagNodes = document.querySelectorAll('.diagram-box .node');
  let diagIdx = 0;
  setInterval(()=>{
    diagNodes.forEach((n,i)=>n.style.opacity = i===diagIdx ? '1' : '0.4');
    diagIdx = (diagIdx+1) % diagNodes.length;
  }, 900);

  // init
  initialBoot();

  // For accessibility: expose state to console (read-only)
  window._sim = {
    getClients: ()=>JSON.parse(JSON.stringify(state.clients)),
    getLogs: ()=>state.logs.slice(),
  };

})();
