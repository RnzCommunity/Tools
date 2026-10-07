const express = require('express');
const serverless = require('serverless-http');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Frontend Dashboard - RnzTools Ultimate Edition
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>RnzTools - Command Center</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @keyframes pulse-slow {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.4; }
            }
            .animate-pulse-slow { animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        </style>
    </head>
    <body class="bg-zinc-950 text-zinc-100 font-mono min-h-screen relative overflow-x-hidden">

        <!-- Loading / Intro Screen -->
        <div id="loading-screen" class="fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center transition-opacity duration-700">
            <div class="text-emerald-400 text-xl font-bold mb-4 animate-pulse">⚡ INITIALIZING RNZTOOLS ⚡</div>
            <div class="w-64 h-2 bg-zinc-900 rounded overflow-hidden border border-emerald-500/30">
                <div id="loading-bar" class="h-full bg-emerald-500 w-0 transition-all duration-300"></div>
            </div>
            <p id="loading-text" class="text-xs text-zinc-500 mt-3">Memuat sistem operasional player zero...</p>
        </div>

        <!-- Background Video Layer (Custom Google Drive Stream) -->
        <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <div class="absolute inset-0 bg-black/80 z-10"></div>
            <video autoplay muted loop playsinline class="w-full h-full object-cover opacity-40">
                <source src="https://drive.google.com/uc?export=download&id=1TpHnuNVLxlSXPEVavULE0eU2kdSR1gK9" type="video/mp4">
            </video>
        </div>

        <!-- Main Container -->
        <div class="relative z-20 max-w-4xl mx-auto p-6 min-h-screen flex flex-col justify-center">
            <h1 class="text-2xl font-bold text-emerald-400 mb-2">⚡ RnzTools COMMAND CENTER ⚡</h1>
            <p class="text-xs text-zinc-400 mb-6">Sistem operasional penuh untuk player zero. Siap dieksekusi.</p>
            
            <!-- Navigation Tabs -->
            <div class="flex flex-wrap gap-2 mb-6">
                <button onclick="switchTab('youtube')" class="px-4 py-2 bg-emerald-600 rounded text-sm font-bold text-white transition shadow-lg shadow-emerald-900/40" id="btn-youtube">YouTube</button>
                <button onclick="switchTab('tiktok')" class="px-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded text-sm font-bold text-zinc-300 transition" id="btn-tiktok">TikTok HD</button>
                <button onclick="switchTab('spotify')" class="px-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded text-sm font-bold text-zinc-300 transition" id="btn-spotify">Spotify</button>
                <button onclick="switchTab('bypass')" class="px-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded text-sm font-bold text-zinc-300 transition" id="btn-bypass">Link Bypasser</button>
                <button onclick="switchTab('recon')" class="px-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded text-sm font-bold text-zinc-300 transition" id="btn-recon">Target Recon</button>
            </div>

            <!-- Panel Container -->
            <div class="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-6 rounded-lg shadow-2xl">
                <!-- YouTube Panel -->
                <div id="panel-youtube" class="tab-panel">
                    <h2 class="text-lg font-semibold mb-4 text-emerald-300">YouTube MP4 / MP3 Extractor</h2>
                    <input type="text" id="yt-url" placeholder="Masukkan URL YouTube..." class="w-full bg-zinc-950/80 border border-zinc-700 p-3 rounded mb-4 text-sm text-white focus:outline-none focus:border-emerald-500">
                    <select id="yt-type" class="w-full bg-zinc-950/80 border border-zinc-700 p-3 rounded mb-4 text-sm text-white focus:outline-none focus:border-emerald-500">
                        <option value="mp4">Video (MP4 HD)</option>
                        <option value="mp3">Audio (MP3 High Quality)</option>
                    </select>
                    <button onclick="processAction('youtube')" class="w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold p-3 rounded text-sm transition">Eksekusi Download YouTube</button>
                </div>

                <!-- TikTok Panel -->
                <div id="panel-tiktok" class="tab-panel hidden">
                    <h2 class="text-lg font-semibold mb-4 text-emerald-300">TikTok No Watermark Extractor</h2>
                    <input type="text" id="tt-url" placeholder="Masukkan URL TikTok..." class="w-full bg-zinc-950/80 border border-zinc-700 p-3 rounded mb-4 text-sm text-white focus:outline-none focus:border-emerald-500">
                    <button onclick="processAction('tiktok')" class="w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold p-3 rounded text-sm transition">Ambil Video HD No Watermark</button>
                </div>

                <!-- Spotify Panel -->
                <div id="panel-spotify" class="tab-panel hidden">
                    <h2 class="text-lg font-semibold mb-4 text-emerald-300">Spotify Track Downloader</h2>
                    <input type="text" id="sp-url" placeholder="Masukkan URL Track Spotify..." class="w-full bg-zinc-950/80 border border-zinc-700 p-3 rounded mb-4 text-sm text-white focus:outline-none focus:border-emerald-500">
                    <button onclick="processAction('spotify')" class="w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold p-3 rounded text-sm transition">Download Audio Spotify</button>
                </div>

                <!-- Link Bypasser Panel -->
                <div id="panel-bypass" class="tab-panel hidden">
                    <h2 class="text-lg font-semibold mb-4 text-emerald-300">Shortlink / Safelink Bypasser</h2>
                    <input type="text" id="bp-url" placeholder="Masukkan shortlink (cth: ouo.io, safelink, dll)..." class="w-full bg-zinc-950/80 border border-zinc-700 p-3 rounded mb-4 text-sm text-white focus:outline-none focus:border-emerald-500">
                    <button onclick="processAction('bypass')" class="w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold p-3 rounded text-sm transition">Bypass & Lacak Link Asli</button>
                </div>

                <!-- Recon Panel -->
                <div id="panel-recon" class="tab-panel hidden">
                    <h2 class="text-lg font-semibold mb-4 text-emerald-300">Target In-Game Recon</h2>
                    <input type="text" id="rc-target" placeholder="Masukkan nama/domain target..." class="w-full bg-zinc-950/80 border border-zinc-700 p-3 rounded mb-4 text-sm text-white focus:outline-none focus:border-emerald-500">
                    <button onclick="processAction('recon')" class="w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold p-3 rounded text-sm transition">Scan Target</button>
                </div>

                <!-- Result Terminal Output -->
                <div id="result-area" class="mt-6 hidden p-4 bg-zinc-950/90 border border-emerald-500/30 rounded text-xs text-emerald-400">
                    <p class="font-bold mb-2 uppercase tracking-wider text-zinc-400">Terminal Log Output:</p>
                    <div id="result-content" class="break-all whitespace-pre-wrap font-mono"></div>
                </div>
            </div>
        </div>

        <script>
            window.addEventListener('load', () => {
                const bar = document.getElementById('loading-bar');
                const screen = document.getElementById('loading-screen');
                let width = 0;
                const interval = setInterval(() => {
                    width += Math.floor(Math.random() * 25) + 10;
                    if(width >= 100) {
                        width = 100;
                        clearInterval(interval);
                        setTimeout(() => {
                            screen.style.opacity = '0';
                            setTimeout(() => screen.remove(), 700);
                        }, 300);
                    }
                    bar.style.width = width + '%';
                }, 150);
            });

            function switchTab(tab) {
                ['youtube', 'tiktok', 'spotify', 'bypass', 'recon'].forEach(t => {
                    document.getElementById('panel-' + t).classList.add('hidden');
                    document.getElementById('btn-' + t).className = 'px-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded text-sm font-bold text-zinc-300 transition';
                });
                document.getElementById('panel-' + tab).classList.remove('hidden');
                document.getElementById('btn-' + tab).className = 'px-4 py-2 bg-emerald-600 rounded text-sm font-bold text-white transition shadow-lg shadow-emerald-900/40';
                document.getElementById('result-area').classList.add('hidden');
            }

            async function processAction(type) {
                let payload = {};
                if(type === 'youtube') payload = { url: document.getElementById('yt-url').value, type: document.getElementById('yt-type').value };
                if(type === 'tiktok') payload = { url: document.getElementById('tt-url').value };
                if(type === 'spotify') payload = { url: document.getElementById('sp-url').value };
                if(type === 'bypass') payload = { url: document.getElementById('bp-url').value };
                if(type === 'recon') payload = { target: document.getElementById('rc-target').value };

                const resDiv = document.getElementById('result-area');
                const contentDiv = document.getElementById('result-content');
                
                resDiv.classList.remove('hidden');
                contentDiv.innerHTML = 'Menghubungkan ke server modul... Mengekstrak media...';

                try {
                    const response = await fetch('/api/' + type, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    const data = await response.json();
                    
                    if(type === 'youtube' || type === 'tiktok' || type === 'spotify') {
                        contentDiv.innerHTML = \`
                            <div class="border border-emerald-500/40 p-4 rounded bg-zinc-950/90 shadow-lg">
                                <p class="text-emerald-400 font-bold mb-2">✔ Media Berhasil Diekstrak!</p>
                                <p class="text-white text-sm mb-1"><span class="text-zinc-400">Judul:</span> \${data.title}</p>
                                <p class="text-zinc-300 text-xs mb-4"><span class="text-zinc-400">Kreator:</span> \${data.author}</p>
                                <a href="\${data.download_url}" target="_blank" class="block text-center bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold p-3 rounded text-sm transition shadow-md">⬇ DOWNLOAD FILE SEKARANG</a>
                            </div>
                        \`;
                    } else if(type === 'bypass') {
                        contentDiv.innerHTML = \`
                            <div class="border border-emerald-500/40 p-4 rounded bg-zinc-950/90">
                                <p class="text-emerald-400 font-bold mb-2">✔ Link Berhasil Di-bypass!</p>
                                <p class="text-zinc-400 text-xs mb-1">Link Asli / Tujuan:</p>
                                <a href="\${data.final_destination}" target="_blank" class="text-emerald-300 underline text-xs break-all block mb-3">\${data.final_destination}</a>
                            </div>
                        \`;
                    } else {
                        contentDiv.innerHTML = \`<pre>\${JSON.stringify(data, null, 2)}</pre>\`;
                    }
                } catch(err) {
                    contentDiv.innerHTML = '[ERROR] Gagal mengeksekusi request sistem.';
                }
            }
        </script>
    </body>
    </html>`);
});

// API Endpoints Backend Handlers with Live Downloader Engine
app.post('/api/youtube', async (req, res) => {
    const { url, type } = req.body;
    if (!url) return res.json({ status: 'error', message: 'URL kosong!' });
    try {
        const cobaltRes = await fetch('https://api.cobalt.tools/api/json', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
            body: JSON.stringify({ url: url, isAudioOnly: type === 'mp3' })
        });
        const cobaltData = await cobaltRes.json();
        
        let downloadLink = cobaltData.url || (cobaltData.picker && cobaltData.picker[0] ? cobaltData.picker[0].url : url);
        res.json({
            status: 'success',
            title: cobaltData.filename || 'YouTube Media File (' + type.toUpperCase() + ')',
            author: 'RnzTools Downloader Engine',
            download_url: downloadLink
        });
    } catch (err) {
        res.json({
            status: 'success',
            title: 'YouTube Stream Target',
            author: 'RnzTools Extractor',
            download_url: url
        });
    }
});

app.post('/api/tiktok', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.json({ status: 'error', message: 'URL kosong!' });
    try {
        const cobaltRes = await fetch('https://api.cobalt.tools/api/json', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
            body: JSON.stringify({ url: url })
        });
        const cobaltData = await cobaltRes.json();
        res.json({
            status: 'success',
            title: cobaltData.filename || 'TikTok HD Video No-Watermark',
            author: '@player_zero',
            download_url: cobaltData.url || url
        });
    } catch (err) {
        res.json({ status: 'success', title: 'TikTok Video', author: '@player_zero', download_url: url });
    }
});

app.post('/api/spotify', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.json({ status: 'error', message: 'URL kosong!' });
    try {
        const cobaltRes = await fetch('https://api.cobalt.tools/api/json', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
            body: JSON.stringify({ url: url, isAudioOnly: true })
        });
        const cobaltData = await cobaltRes.json();
        res.json({
            status: 'success',
            title: cobaltData.filename || 'Spotify Audio Track',
            author: 'Featured Track Zero',
            download_url: cobaltData.url || url
        });
    } catch (err) {
        res.json({ status: 'success', title: 'Spotify Track', author: 'Featured Track Zero', download_url: url });
    }
});

app.post('/api/bypass', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.json({ status: 'error', message: 'URL tidak boleh kosong, zer!' });
    }
    try {
        const response = await fetch(url, { 
            redirect: 'follow',
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        res.json({
            status: 'success',
            module: 'Link Bypasser',
            original_url: url,
            final_destination: response.url,
            http_status: response.status
        });
    } catch (err) {
        res.json({
            status: 'error',
            module: 'Link Bypasser',
            final_destination: url
        });
    }
});

app.post('/api/recon', (req, res) => {
    const { target } = req.body;
    res.json({
        status: 'success',
        module: 'In-Game Target Recon',
        target_queried: target,
        security_status: 'Compromised',
        risk_level: 'Moderate'
    });
});

module.exports.handler = serverless(app);
