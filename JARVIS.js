//main JS for JARVIS Webserver
// Simple lightweight client for JARVIS WEBSERVER (WebSocket-based)
let currentContactType = "FIRE";
(() => {
  const wsUrl = (location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.hostname + ':81/';
  let ws;
  let wsConnected = false;
  const toast = msg => {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._tm); t._tm = setTimeout(()=>t.classList.remove('show'),2500);
  };

  // UI helpers
  const qs = s => document.querySelector(s);
  const qsa = s => Array.from(document.querySelectorAll(s));

  // Navigation & sidebar
  const menuBtn = qs('#menuBtn'), sidebar = qs('#sidebar');
  menuBtn.addEventListener('click', e => sidebar.classList.toggle('hidden'));
  qsa('.navbtn').forEach(b=>{
    b.addEventListener('click', ()=> {
      qsa('.navbtn').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      qsa('.page').forEach(p=>p.classList.remove('active'));
      qs('#' + b.dataset.section).classList.add('active');
    });
  });
  qs('#logoutBtn').addEventListener('click', ()=> {
    ws.send("/logout");
//    if(ws) ws.close();
//    toast('Logged out');
  });

  // Build status badges
  // const statusBar = qs('#statusBar');
//  const statusKeys = ['ComIP','Battery','Siren','WiFi','LAN','GSM','System'];
//  statusKeys.forEach(k=>{
//    const b = document.createElement('div'); b.className='badge'; b.id='st_'+k;
//    b.textContent = k+': -'; statusBar.appendChild(b);
//  });
  // WebSocket connect & handlers
  function connect(){
    //try {
      ws = new WebSocket(wsUrl);
    //} catch(e){ toast('WS init failed'); return; }
    ws.onopen = ()=> {
      //  toast('WS connected'); 
      //  sendPing(); 
      wsConnected = true;
    console.log("✅ WebSocket Connected");
    updateComIPStatus(true);
      };
    ws.onclose = ()=> { 
      // toast('WS closed'); 
      // setTimeout(connect,2000); 
      wsConnected = false;
    console.log("❌ WebSocket Disconnected");
    updateComIPStatus(false);
    // try reconnect after delay
    setTimeout(connect, 1000);
    };
    ws.onerror = ()=> { 
      wsConnected = false;
    updateComIPStatus(false);
      //console.warn(e); 
    };
    ws.onmessage = (event) => {
      // try {
      //   const msg = JSON.parse(e.data);
      //   console.log(msg);
      //   handleMsg(msg);
      // } catch(err){
      //   console.log('raw', e.data);
      // }
       handleMsg(event.data);
    };
  }
  function updateComIPStatus(isConnected) {
   const el = qs("#st_ComIP");
  //const el="ComIP: Connected";
  console.log(el);
  if (!el) return;

  if (isConnected) {
    el.textContent = "ComIP: Connected";
    el.classList.remove("red-static");
    el.classList.add("blink-green");
  } else {
    el.textContent = "ComIP: Disconnected";
    el.classList.remove("blink-green");
    el.classList.add("red-static");
  }
}
  function send(obj){
    if(!ws || ws.readyState !== WebSocket.OPEN){ toast('WS not connected'); return; }
    ws.send(JSON.stringify(obj));
  }
  function sendPing(){ send({type:'ping',ts:new Date().toISOString()}); }

  // Incoming message handling (simple)
  function handleMsg(raw) {
  // convert raw WebSocket message to string
  let msg = typeof raw === "string" ? raw.trim() : "";
  if (!msg) return;

  console.log("RX:", msg);

  // ---- SYSTEM STATUS ----
  if (msg.startsWith("Battery:")) {
    const val = msg.split(":")[1].trim();
    const el = qs("#st_Battery");
    if (el) {
      el.textContent = "Battery: " + val;
      el.style.background = (val.toLowerCase() === "connected") ? "#4CAF50" : "#F44336";
    }
    return;
  }

  if (msg.startsWith("Siren:")) {
    const val = msg.split(":")[1].trim();
    const el = qs("#st_Siren");
    if (el) {
      el.textContent = "Siren: " + val;
      el.style.background = (val.toLowerCase() === "connected") ? "#4CAF50" : "#F44336";
    }
    return;
  }
  if (msg.startsWith("M.Siren:")) {
    const val = msg.split(":")[1].trim();
    const el = qs("#st_M_Siren");
    if (el) {
      el.textContent = "M.Siren: " + val;
      el.style.background = (val.toLowerCase() === "connected") ? "#4CAF50" : "#F44336";
    }
    return;
  }

  if (msg.startsWith("WiFi:")) {
    const val = msg.split(":")[1].trim();
    const el = qs("#st_WiFi");
    if (el) {
      el.textContent = "WiFi: " + val;
      el.style.background = (val.toLowerCase() === "connected") ? "#4CAF50" : "#F44336";
    }
    return;
  }

  if (msg.startsWith("LAN:")) {
    const val = msg.split(":")[1].trim();
    const el = qs("#st_LAN");
    if (el) {
      el.textContent = "LAN: " + val;
      el.style.background = (val.toLowerCase() === "connected") ? "#4CAF50" : "#F44336";
    }
    return;
  }
  if (msg.startsWith("GSM:")) {
    const val = msg.split(":")[1].trim();
    const el = qs("#st_GSM");
    if (el) {
      el.textContent = "GSM: " + val;
      el.style.background = (val.toLowerCase() === "connected") ? "#4CAF50" : "#F44336";
    }
    return;
  }
  if (msg.startsWith("Power:")) {
    const val = msg.split(":")[1].trim();
    const el = qs("#st_Power");
    if (el) {
      el.textContent = "Power: " + val;
      el.style.background = (val.toLowerCase() === "main") ? "#4CAF50" : "#F44336";
    }
    return;
  }
   if (msg.startsWith("Mode:")) {
    const val = msg.split(":")[1].trim();
    const el = qs("#st_Mode");
    if (el) {
      el.textContent = "Mode: " + val;
      el.style.background = (val.toLowerCase() === "day") ? "#4CAF50" : "#bbb6b6ff";
    }
    return;
  }
   if (msg.startsWith("Tamp:")) {
    const val = msg.split(":")[1].trim();
    const el = qs("#st_Tamp");
    if (el) {
      el.textContent = "Tamp: " + val;
      el.style.background = (val.toLowerCase() === "normal") ? "#4CAF50" : "#F44336";
    }
    return;
  }
  if (msg.startsWith("System:")) {
    const val = msg.split(":")[1].trim();
    const el = qs("#st_System");
    if (el) {
      el.textContent = "System: " + val;
      el.style.background = (val.toLowerCase() === "darm") ? "#4CAF50" : "#F44336";
    }
    return;
  }

   // ---- ZONE STATUS ----
if (msg.toLowerCase().startsWith("zone")) {
  // Example input:  Zone01: :Day:Fire
  const parts = msg.split(":").map(s => s.trim()).filter(Boolean);

  const zone = parts[0];            // Zone01
  const mode = parts[1] || "";      // Day
  const val  = parts[2] || "";      // Fire

  // Find element for this zone
  const card = document.querySelector(`.zonecard[data-zone="${zone.toUpperCase()}"]`);
  const sel = card ? card.querySelector('.zonestatus') : null;
  
  if (card && sel) {
    sel.textContent = `${mode}:${val}`;// show "Day:Fire"
    // background color and card border based on status
    const status = val.toLowerCase();
    
    if (status === "trigger") {
      card.style.border = "2px solid #F44336"; // Red border for trigger
      sel.style.background = "#F44336";  // red badge
      sel.style.color = "#fff";
    } else if (status === "normal" || status === "ok") {
      card.style.border = "2px solid #4CAF50"; // Green border for normal
      sel.style.background = "#4CAF50";  // green badge
      sel.style.color = "#fff";
    } else if (status === "open") {
      card.style.border = "1px solid #e6e9ef"; // Reset to default border
      sel.style.background = "#FF9800";  // orange
      sel.style.color = "#000";
    } else if (status === "short") {
      card.style.border = "1px solid #e6e9ef"; // Reset to default border
      sel.style.background = "#E91E63";  // pinkish for short
      sel.style.color = "#fff";
    } else {
      card.style.border = "1px solid #e6e9ef"; // Reset to default border
      sel.style.background = "#FFA726";  // gray (unknown)
      sel.style.color = "#fff";
    }
  }
  return;
}
// ---- GSM MONITOR DATA ----
if (msg.startsWith("GSM_SIG:")) {
  console.log("entered");
  const dbm = parseInt(msg.split(":")[1]); // -72
  console.log("data=",dbm);
  updateGsmSignalBars(dbm);
  return;
}

if (msg.startsWith("GSM_OPERATOR:")) {
  qs("#gsmOperator").textContent = msg.split(":")[1].trim();
  return;
}

if (msg.startsWith("GSM_MQTT:")) {
  qs("#gsmMqtt").textContent = msg.split(":")[1].trim();
  return;
}
// ---- CONTACT VIEW (HTML TABLE FROM ESP32) ----
if (msg.startsWith("NUM:")) {

  const rawHtml = msg.substring(4);
  const box = qs("#contactTable");
  if (!box) return;

  box.innerHTML = rawHtml;

  // 🔥 Har row me Delete button add karna
  const rows = box.querySelectorAll("table tr");

  rows.forEach((row, index) => {

    // header row skip
    if(index === 0) {
      const th = document.createElement("th");
      th.textContent = "Action";
      row.appendChild(th);
      return;
    }

    const td = document.createElement("td");
    const btn = document.createElement("button");

    btn.textContent = "Delete";
    btn.className = "btn small";
    btn.style.background = "#d9534f";

    btn.addEventListener("click", ()=>{

      // index-1 because header skipped
      const delIndex = row.children[0].textContent;;

      ws.send(`DEL_${currentContactType}_${delIndex}`);
      toast(`Delete sent for index ${delIndex}`);

    });

    td.appendChild(btn);
      row.appendChild(td);

    });

    return;
  }
  console.warn("Unhandled message:", msg);
}
window.handleMsg = handleMsg; // Expose for testing

  // Zone controls: EMCP and mode select
  qsa('.zonecard').forEach(card=>{
    const zone = card.dataset.zone;
    const emcpBtn = card.querySelector('.emcp');
  if(emcpBtn){
    emcpBtn.addEventListener('click', ()=>{
      //send({type:'zone_command',zone,command:'EMCP'});
      //ws.send(`${zone}|EMCP`);
      ws.send(`EMCPTRIGR`);
      toast(zone + ' EMCP sent');
    });
  }
    const sel = card.querySelector('.modeSelect');
    sel.addEventListener('change', ()=>{
      if(!sel.value) return;
      //send({type:'zone_set_mode',zone,mode:sel.value});
      ws.send(`ZoneMode:${zone}|${sel.value}`);
      toast(zone + ' mode '+sel.value+' sent');
      //sel.value = ''; // reset
    });
  });

  // System config handlers
  qs('#saveTime').addEventListener('click', ()=>{
    const v = qs('#sysDatetime').value;
    if(!v){ toast('Select date/time'); return; }
    //send({DATETIME_v});
    ws.send(`DATETIME_${v}`);
    toast('Time sent');
  });
      // --- Save Protocol only ---
    qs('#saveProtocol').addEventListener('click', ()=>{
      const protocol = qs('#protocol').value;
      //send({type:'system_config', protocol});
      ws.send(`PROTOCOL_${protocol}`);
      toast('Protocol sent: ' + protocol);
    });
    
    // --- Save Notification (multiple) ---
    qs('#saveNotification').addEventListener('click', ()=>{
      const checks = Array.from(document.querySelectorAll('.notifCheck:checked')).map(c => c.value);
      if(checks.length === 0){ toast('Select at least one notification'); return; }
      send({type:'system_config', notification: checks});
      ws.send(`NOTIFIES_${checks}`);
      toast('Notification sent: ' + checks.join(', '));
    });
  qs('#saveNumber').addEventListener('click', ()=>{
    const payload = {type:'add_contact',kind:qs('#numType').value,number:qs('#numPhone').value,email:qs('#numEmail').value,serial:qs('#numSerial').value};
    if(!payload.number){ toast('Phone required'); return; }
    //ws.send(`${qs('#numType').value},${qs('#numSerial').value},${qs('#numPhone').value},${qs('#numEmail').value}`);
      ws.send(`CONTACTS_${qs('#numSerial').value},${qs('#numPhone').value}`);
    //send(payload);
    toast('Contact sent');
  });
  qs('#saveBranch').addEventListener('click', ()=>{
    const p = {type:'add_branch',name:qs('#branchName').value,address:qs('#branchAddr').value};
    if(!p.name){ toast('Branch name required'); return; }
    ws.send(`BRANCH___${qs('#branchName').value},${qs('#branchAddr').value}`);
    send(p); toast('Branch sent');
  });
  // OTA
  qs('#otaCheck').addEventListener('click', ()=>{ ws.send(`ota_check`); toast('OTA check sent'); });
  qs('#otaUpdate').addEventListener('click', ()=>{ ws.send(`ota_update`); toast('OTA update sent'); });

// ---- Zone Time (One Mode for both Day + Night) ----
const modeSelect = qs("#panelDNModeSelect");
//const DNmodeSelect = qs("#DNModeSelect");
const dayTime = qs("#DAY_TIME");
const nightTime = qs("#NIGHT_TIME");

modeSelect.addEventListener("change", () => {
  const mode = modeSelect.value;

  if (mode === "MANUAL") {
    dayTime.disabled = true;
    nightTime.disabled = true;
    ws.send("DY_NTMODEMANUAL");
    toast("Mode: MANUAL");
  } else {
    dayTime.disabled = false;
    nightTime.disabled = false;
    ws.send("DY_NTMODEAUTOMT");
    toast("Mode: AUTOMATIC");
  }
});

//DNmodeSelect.addEventListener("change", () => {
//  const mode = DNmodeSelect.value;
//
//  if (mode === "DAY") {
//    dayTime.disabled = true;
//    nightTime.disabled = true;
//    ws.send("PANELMODEDAY");
//    toast("Mode: Day");
//  } else {
//    dayTime.disabled = false;
//    nightTime.disabled = false;
//    ws.send("PANELMODENIGHT");
//    toast("Mode: NIGHT");
//  }
//});

qs("#saveZoneTime").addEventListener("click", () => {
  ws.send(`DAYTIME__${dayTime.value}`);
  ws.send(`NIGHTTIME${nightTime.value}`);
  toast("Day & Night time sent.");
});

// ---- Zone Time (One Mode for both ARM + DARM) ----
const a_dmodeSelect = qs("#ARM_DARMModeSelect");
const armTime = qs("#ARM_TIME");
const darmTime = qs("#DARM_TIME");

a_dmodeSelect.addEventListener("change", () => {
  const mode1 = a_dmodeSelect.value;
  console.log(mode1);
  if (mode1 === "MANUAL") {
    armTime.disabled = true;
    darmTime.disabled = true;
    ws.send("ARM-DARM_MANUAL");
    toast("Mode: MANUAL");
  } else {
    armTime.disabled = false;
    darmTime.disabled = false;
    ws.send("ARM-DARM_AUTOMT");
    toast("Mode: AUTOMATIC");
  }
});
qs("#saveA_DZoneTime").addEventListener("click", () => {
  ws.send(`ARMTIME__${armTime.value}`);
  ws.send(`DARM_TIME${darmTime.value}`);
  toast("ARM & DARM time sent.");
});   
 
// ---- Night Cut and Sounder Time ----
const NightCutSelect = qs("#NightCutSelect");
const SounderTime = qs("#Sounder_TIME");
//const darmTime = qs("#DARM_TIME");

NightCutSelect.addEventListener("change", () => {
  const mode2 = NightCutSelect.value;
  console.log(mode2);
  if (mode2 === "ENABLE") {
    //armTime.disabled = true;
    //darmTime.disabled = true;
    ws.send("NightCut_ENABLE");
    toast("Mode: ENABLE");
  } else {
    //armTime.disabled = false;
    //darmTime.disabled = false;
    ws.send("NightCut_DISABLE");
    toast("Mode: DISABLE");
  }
});                
// qs("#SaveSounderTime").addEventListener("click", () => {
//   ws.send(`SounderTM${SounderTime.value}`);
//   ///ws.send(`DARM_TIME${darmTime.value}`);
//   toast("Sounder Time sent.");
// }); 

qs("#SaveSounderTime").addEventListener("click", () => {
  const sounderValue = parseInt(SounderTime.value);
  if (isNaN(sounderValue) || sounderValue > 120) {
    alert("Sounder can be set maximum of 120 seconds");
    return;
  }
  ws.send(`SounderTM${SounderTime.value}`);
  toast("Sounder Time sent.");
});
 

// --- Save ARM / DISARM ---
qs('#saveArmDisarm').addEventListener('click', () => {
  const selected = document.querySelector('input[name="armMode"]:checked');
  if (!selected) { toast('Select ARM or DISARM first'); return; }
  ws.send(`Arm_Drm__${selected.value}`);
  toast(selected.value + ' mode sent');
});
// --- Event Table Refresh ---
qs('#refreshEvent').addEventListener('click', ()=>{
  ws.send(`get_event`);
  toast('Requesting event data...');
});

// --- Contact Table Refresh ---
qs('#showFire').addEventListener('click', ()=>{
  currentContactType = "FIRE";
  ws.send("GetFireNo");
  //ws.send("GET__NUM_");
  toast("Requesting FIRE numbers...");
});

qs('#showIntr').addEventListener('click', ()=>{
  currentContactType = "INTR";
  ws.send("GET_INTR_NUM");
  toast("Requesting INTR numbers...");
});

// --- Holiday List Refresh ---
qs('#refreshHoliday').addEventListener('click', ()=>{
  ws.send(`get_holiday`);
  toast('Requesting holiday list...');
});

// --- Save MQTT Credential ---
qs('#saveMqtt').addEventListener('click', ()=>{
  const data = {
    type: 'mqtt_cred',
    auth: qs('#mqttAuth').value.trim(),
    user: qs('#mqttUser').value.trim(),
    pass: qs('#mqttPass').value.trim()
  };
  ws.send(`MQTTINFO_${qs('#mqttAuth').value},${qs('#mqttUser').value},${qs('#mqttPass').value}`);
  toast('MQTT credentials sent');
});

// --- Save WiFi Credential ---
qs('#saveWifi').addEventListener('click', ()=>{
  const data = {
    type: 'wifi_cred',
    ssid: qs('#wifiSsid').value.trim(),
    pass: qs('#wifiPass').value.trim()
  };
  ws.send(`WIFIINFO_${qs('#wifiSsid').value},${qs('#wifiPass').value}`);
  toast('WiFi credentials sent');
});
// REC/PLAY mutual exclusion: when rec clicked disable play for same slot and vice versa
  qsa('.pair').forEach(pair=>{
    const slot = pair.dataset.slot;
    console.log(slot);
    const rec = pair.querySelector('.btn.rec'), play = pair.querySelector('.btn.play');
    rec?.addEventListener('click', ()=>{
      if(rec.disabled) return;
      // disable play while rec action in progress
      play.disabled = true;
      send({type:'rec_msg',slot});
      toast('Rec '+slot);
      setTimeout(()=>play.disabled = false, 2500); // simulate
    });
    play?.addEventListener('click', ()=>{
      if(play.disabled) return;
      rec.disabled = true;
      send({type:'play_msg',slot});
      toast('Play '+slot);
      setTimeout(()=>rec.disabled = false, 2500);
    });
  });
                                                                              
  // try connect
  connect();

  // ping every 30s
  //setInterval(()=>{ if(ws && ws.readyState===WebSocket.OPEN) sendPing(); },30000);

  // Optionally update date/time badge
  setInterval(()=> {
    const d = new Date();
    const statusBar = qs('#statusBar');
    const el = document.createElement('div'); el.className='badge'; el.id='st_DATE';
    el.textContent = d.toLocaleString();
    const old = qs('#st_DATE'); if(old) old.replaceWith(el); else statusBar.appendChild(el);
  },1000);

  // --- GSM APN SAVE ---
qs('#saveGsmApn')?.addEventListener('click', () => {
  const apn = qs('#gsm_apn').value.trim();
  if (!apn) {
    toast('APN empty');
    return;
  }
  ws.send(`GSM__APN_${apn}`);
  toast('APN sent to GSM');
});
// --- GSM RESET ---
qs('#gsmReset')?.addEventListener('click', () => {
  ws.send('GSM_RESET');
  toast('GSM Reset command sent');
});
function updateGsmSignalBars(dbm) {
  const bars = document.querySelectorAll("#gsmSignal span");
  let level = 0;
  console.log(dbm);
  if (dbm >= 30) level = 5;
  else if (dbm >= 24) level = 4;
  else if (dbm >= 18) level = 3;
  else if (dbm >= 12) level = 2;
  else if (dbm >= 6) level = 1;
  else level = 0;
  
  bars.forEach((bar, index) => {
    console.log("hello");
    console.log(index);
    console.log(level);
    if (index < level) bar.classList.add("active");
    else bar.classList.remove("active");
  });
}
})();


// JARVIS Webserver Mobile version JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // ===== SIDEBAR TOGGLE FUNCTIONALITY =====
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  
  // Mobile menu toggle
  function toggleMobileMenu() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      sidebar.classList.toggle('mobile-open');
      sidebarOverlay.classList.toggle('active');
      document.body.style.overflow = sidebar.classList.contains('mobile-open') ? 'hidden' : '';
    } else {
      // Desktop: toggle between visible and hidden
      sidebar.classList.toggle('hidden');
    }
  }
  
  function closeMobileMenu() {
    sidebar.classList.remove('mobile-open');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  if (menuBtn) {
    menuBtn.addEventListener('click', toggleMobileMenu);
  }
  
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeMobileMenu);
  }
  
  // Close menu when clicking nav buttons on mobile
  const navButtons = document.querySelectorAll('.navbtn');
  navButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        closeMobileMenu();
      }
    });
  });
  
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (window.innerWidth > 768) {
        closeMobileMenu();
        // Reset sidebar position for desktop
        sidebar.classList.remove('mobile-open');
        sidebar.style.position = '';
        sidebar.style.top = '';
        sidebar.style.height = '';
        sidebar.style.transform = '';
      }
      // Mobile styles are handled by CSS, no need to set inline styles
    }, 250);
  });
  
  // No need for initial resize check - CSS handles it

  // ===== NAVIGATION =====
  const pages = document.querySelectorAll('.page');
  const navBtns = document.querySelectorAll('.navbtn');
  
  navBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const targetSection = this.getAttribute('data-section');
      
      // Update active nav button
      navBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Show target page
      pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === targetSection) {
          page.classList.add('active');
        }
      });
    });
  });

  // ===== TOAST NOTIFICATIONS =====
  window.showToast = function(message, duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };

  // ===== RESPONSIVE HELPERS =====
  // Add responsive class to body for CSS targeting
  function updateResponsiveClass() {
    const width = window.innerWidth;
    document.body.classList.remove('mobile', 'tablet', 'desktop');
    
    if (width <= 480) {
      document.body.classList.add('mobile');
    } else if (width <= 1024) {
      document.body.classList.add('tablet');
    } else {
      document.body.classList.add('desktop');
    }
  }
  
  updateResponsiveClass();
  window.addEventListener('resize', updateResponsiveClass);

  // ===== CUSTOM SELECT DROPDOWNS =====
  function initCustomSelects() {
    const selects = document.querySelectorAll('select');
    
    selects.forEach(select => {
      // Skip if already initialized
      if (select.parentElement.classList.contains('custom-select-wrapper')) return;
      
      const wrapper = document.createElement('div');
      wrapper.className = 'custom-select-wrapper';
      if (select.className) wrapper.classList.add(...select.classList);
      
      const trigger = document.createElement('div');
      trigger.className = 'custom-select-trigger';
      trigger.textContent = select.options[select.selectedIndex]?.textContent || '--Select--';
      
      const optionsContainer = document.createElement('div');
      optionsContainer.className = 'custom-select-options';
      
      // Build custom options
      Array.from(select.options).forEach((option, index) => {
        const customOption = document.createElement('div');
        customOption.className = 'custom-option';
        if (index === select.selectedIndex) customOption.classList.add('selected');
        customOption.textContent = option.textContent;
        customOption.dataset.value = option.value;
        
        customOption.addEventListener('click', () => {
          // Update native select
          select.value = option.value;
          
          // Update UI
          trigger.textContent = option.textContent;
          wrapper.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
          customOption.classList.add('selected');
          
          // Close dropdown
          wrapper.classList.remove('open');
          
          // Trigger native change event
          select.dispatchEvent(new Event('change'));
        });
        
        optionsContainer.appendChild(customOption);
      });
      
      // Wrap the select
      select.parentNode.insertBefore(wrapper, select);
      wrapper.appendChild(select);
      wrapper.appendChild(trigger);
      wrapper.appendChild(optionsContainer);
      
      // Hide native select but keep it functional for logic
      select.style.display = 'none';
      
      // Toggle dropdown
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close other dropdowns first
        document.querySelectorAll('.custom-select-wrapper').forEach(w => {
          if (w !== wrapper) w.classList.remove('open');
        });
        wrapper.classList.toggle('open');
      });
    });
  }

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
  });

  // Initialize on load
  initCustomSelects();

  // Watch for dynamic DOM changes (like Event Table or Contact Table)
  const observer = new MutationObserver(() => initCustomSelects());
  observer.observe(document.body, { childList: true, subtree: true });

  // ===== ZONE CARD CONTROLS =====
  const zoneCards = document.querySelectorAll('.zonecard');
  
  zoneCards.forEach(card => {
    const emcpBtn = card.querySelector('.emcp');
    const modeSelect = card.querySelector('.modeSelect');
    const zoneName = card.querySelector('.zonename').textContent;
    
    if (emcpBtn) {
      emcpBtn.addEventListener('click', function() {
        const zone = card.getAttribute('data-zone');
        // TODO: Implement EMCP command
        showToast(`EMCP triggered for ${zoneName}`);
      });
    }
    
    if (modeSelect) {
      modeSelect.addEventListener('change', function() {
        const mode = this.value;
        const zone = card.getAttribute('data-zone');
        if (mode) {
          // TODO: Implement mode change
          showToast(`${zoneName} mode: ${mode}`);
        }
      });
    }
  });

  // ===== STATUS BAR AUTO-SCROLL (Mobile) =====
  const statusBar = document.getElementById('statusBar');
  if (statusBar && window.innerWidth <= 480) {
    let isScrolling = false;
    
    function autoScrollStatus() {
      if (isScrolling) return;
      isScrolling = true;
      
      const scrollAmount = 50;
      const maxScroll = statusBar.scrollWidth - statusBar.clientWidth;
      let currentScroll = statusBar.scrollLeft;
      
      if (currentScroll >= maxScroll) {
        statusBar.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        statusBar.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
      
      setTimeout(() => {
        isScrolling = false;
      }, 2000);
    }
    
    // Auto-scroll on idle (optional - commented out by default)
    // setInterval(autoScrollStatus, 5000);
  }

  console.log('JARVIS Webserver initialized');
});