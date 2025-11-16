let clientCount = 0;

// Galaxy / Cyberpunk wallpaper
const wallpapers = [
    "https://i.imgur.com/4ZQZ4YI.jpeg",
    "https://i.imgur.com/XF0Yy8c.jpeg",
    "https://i.imgur.com/7z4cW8x.jpeg"
];

// Auto generate client
function spawnClient() {
    clientCount++;
    const id = clientCount;
    const container = document.getElementById("client-container");

    const card = document.createElement("div");
    card.className = "client-card";
    card.id = "client_" + id;

    card.innerHTML = `
        <div class="client-header">Client_${id}</div>
        <div class="client-wallpaper" id="wall_${id}" style="background-image: url('${wallpapers[0]}');"></div>

        <div class="client-info" id="info_${id}">
            Status: ONLINE<br>
            IP: 192.168.0.${id}<br>
            OS: Android 12<br>
        </div>

        <div class="button-group">
            <button onclick="flashlight(${id})">Flashlight</button>
            <button onclick="changeWallpaper(${id})">Wallpaper</button>
            <button onclick="popup(${id})">Popup</button>
            <button onclick="getInfo(${id})">Get Info</button>
            <button onclick="shutdown(${id})">Shutdown</button>
        </div>
    `;

    container.appendChild(card);

    log(`Client_${id} connected.`);
}

// LOG FUNCTION
function log(msg) {
    const logBox = document.getElementById("log");
    logBox.innerHTML += `[${new Date().toLocaleTimeString()}] ${msg}<br>`;
    logBox.scrollTop = logBox.scrollHeight;
}

// Controls
function flashlight(id) {
    log(`Flashlight ON on Client_${id}`);

    const card = document.getElementById("client_" + id);
    card.style.boxShadow = "0 0 40px white";

    setTimeout(() => {
        card.style.boxShadow = "0 0 20px #00eaff";
    }, 700);
}

function changeWallpaper(id) {
    const wp = wallpapers[Math.floor(Math.random() * wallpapers.length)];
    document.getElementById("wall_" + id).style.backgroundImage = `url('${wp}')`;
    log(`Wallpaper changed on Client_${id}`);
}

function popup(id) {
    alert(`Popup executed on Client_${id}`);
    log(`Popup executed on Client_${id}`);
}

function getInfo(id) {
    log(`System Info requested on Client_${id}`);
}

function shutdown(id) {
    const info = document.getElementById("info_" + id);
    info.innerHTML = "<b>Status:</b> OFFLINE";

    log(`Client_${id} shut down`);
}

// Auto spawn clients every 3 seconds
setInterval(spawnClient, 3000);

// Auto logs
setInterval(() => {
    log("Heartbeat signal OK...");
}, 4000);
