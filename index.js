try { process.loadEnvFile(); } catch (e) { } // Native .env support for Node.js 20+
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

// Global States
let currentQR = '';
let isAuthenticated = false;
let isAiEnabled = false; // Toggle for OpenRouter AI Auto-Responder

// 1. Initialize the WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true, // Run in background
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// ==========================================
// WEBSOCKET (SOCKET.IO) LOGIC
// ==========================================

io.on('connection', (socket) => {
    console.log('💻 New Web Dashboard client connected');

    socket.emit('status_update', { authenticated: isAuthenticated, qr: currentQR });
    socket.emit('ai_status_update', isAiEnabled);

    socket.on('get_contacts', async () => {
        if (!isAuthenticated) return;
        try {
            const contacts = await client.getContacts();
            const savedContacts = contacts
                .filter(c => c.isMyContact && !c.isGroup)
                .map(c => ({
                    id: c.id._serialized,
                    name: c.name || c.pushname || c.number,
                    number: c.number
                }));
            savedContacts.sort((a, b) => a.name.localeCompare(b.name));
            socket.emit('contacts_list', savedContacts);
        } catch (error) {
            console.error('Failed to load contacts:', error);
        }
    });

    socket.on('toggle_ai', (state) => {
        isAiEnabled = state;
        console.log(`🤖 AI Auto-Responder is now ${isAiEnabled ? 'ON' : 'OFF'}`);
        io.emit('ai_status_update', isAiEnabled);
    });

    socket.on('user_typing', async (data) => {
        const { targetId } = data;
        if (!targetId || isAiEnabled) return;
        try {
            const chat = await client.getChatById(targetId);
            await chat.sendStateTyping();
        } catch (e) { }
    });

    socket.on('user_stopped_typing', async (data) => {
        const { targetId } = data;
        if (!targetId || isAiEnabled) return;
        try {
            const chat = await client.getChatById(targetId);
            await chat.clearState();
        } catch (e) { }
    });

    socket.on('send_message', async (data) => {
        const { targetId, message } = data;
        if (!targetId || !message) {
            socket.emit('message_status', { status: 'error', text: 'Contact and message are required' });
            return;
        }

        try {
            socket.emit('message_status', { status: 'sending', text: '🚀 Sending to WhatsApp servers...' });
            await client.sendMessage(targetId, message);
            console.log(`Manual message sent to ${targetId}`);
            socket.emit('message_status', { status: 'success', text: '✅ Message sent successfully!' });
        } catch (error) {
            console.error('Failed to send message:', error);
            socket.emit('message_status', { status: 'error', text: '❌ Failed: ' + error.toString() });
        }
    });
});

// ==========================================
// WHATSAPP EVENTS & AI INTEGRATION
// ==========================================

client.on('qr', (qr) => {
    console.log('New QR code received.');
    currentQR = qr;
    isAuthenticated = false;
    qrcode.generate(qr, { small: true });
    io.emit('qr', qr);
});

client.on('ready', () => {
    console.log('WhatsApp Web session is authenticated and ready!');
    isAuthenticated = true;
    currentQR = '';
    io.emit('ready');
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
    isAuthenticated = false;
    currentQR = '';
    io.emit('disconnected');
});

// LISTEN FOR INCOMING MESSAGES TO TRIGGER AI
client.on('message', async msg => {
    // If AI is off, or if message is from a group or channel, do nothing!
    if (!isAiEnabled) return;
    if (msg.from.includes('@g.us') || msg.from.includes('@newsletter') || msg.isStatus) return;

    console.log(`📥 Received message from ${msg.from}: ${msg.body}`);

    try {
        const chat = await msg.getChat();

        await chat.sendSeen();
        if (typeof chat.sendStateTyping === 'function') {
            await chat.sendStateTyping(); // Real humanized typing!
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: "You are a helpful WhatsApp AI assistant. Keep responses short and conversational." }]
                },
                contents: [
                    { role: "user", parts: [{ text: msg.body }] }
                ]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0] && data.candidates[0].content.parts[0].text) {
            const aiReply = data.candidates[0].content.parts[0].text;

            let typingDuration = Math.min(aiReply.length * 60, 6000);
            await new Promise(resolve => setTimeout(resolve, typingDuration));

            await client.sendMessage(msg.from, aiReply);
            console.log(`🤖 AI Replied to ${msg.from}`);
        } else {
            console.error("Google Gemini API Error:", data);
            await chat.clearState();
        }

    } catch (e) {
        console.error("Failed to generate AI reply:", e);
    }
});

client.initialize();

// ==========================================
// WEB FRONTEND DASHBOARD
// ==========================================

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>WhatsApp Live Agent</title>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
            <script src="/socket.io/socket.io.js"></script>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background-color: #f0f2f5; margin: 0; padding: 20px;}
                .card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); text-align: center; max-width: 450px; width: 100%; box-sizing: border-box; }
                h2 { color: #128C7E; margin-top: 0; }
                #qrcode { margin: 24px auto; display: flex; justify-content: center; min-height: 256px; align-items: center;}
                .status { margin-top: 20px; font-weight: 500; color: #555; font-size: 16px; }
                .success { color: #25D366; font-weight: bold; font-size: 18px; }
                
                /* AI Toggle Switch */
                .toggle-container { margin: 20px 0; padding: 15px; background: #e8f5e9; border-radius: 8px; border: 2px solid #25D366; display: flex; align-items: center; justify-content: space-between; text-align: left;}
                .toggle-container strong { color: #128C7E; font-size: 16px; }
                .switch { position: relative; display: inline-block; width: 50px; height: 26px; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
                .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
                input:checked + .slider { background-color: #25D366; }
                input:checked + .slider:before { transform: translateX(24px); }
                
                /* Chat UI Styles */
                #chatInterface { display: none; margin-top: 10px; padding-top: 15px; border-top: 1px solid #eee; text-align: left; }
                .chat-label { font-size: 12px; color: #666; margin-bottom: 5px; display: block; font-weight: bold; }
                select { width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; outline: none; background: white; cursor: pointer; }
                input[type="text"] { width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box; font-size: 14px; outline: none; }
                input[type="text"]:focus, select:focus { border-color: #128C7E; }
                button { width: 100%; padding: 12px; background-color: #25D366; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 15px; transition: background 0.2s; }
                button:hover { background-color: #1DA851; }
                button:disabled { background-color: #9cd5b3; cursor: not-allowed; }
                #sendResult { margin-top: 12px; font-size: 14px; text-align: center; height: 20px; font-weight: 500;}
                .live-indicator { font-size: 12px; color: #888; text-align: center; display: block; margin-bottom: 10px; font-style: italic; }
            </style>
        </head>
        <body>
            <div class="card">
                <h2>WhatsApp AI Dashboard</h2>
                <div id="qrcode"></div>
                <div class="status" id="statusText">Connecting to server...</div>
                
                <div id="chatInterface">
                    
                    <!-- AI Toggle Section -->
                    <div class="toggle-container">
                        <div>
                            <strong>🤖 AI Auto-Reply</strong><br>
                            <span style="font-size:12px; color:#555;">Automatically replies to ALL incoming messages using Google Gemini AI.</span>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="aiToggle" onchange="toggleAiMode()">
                            <span class="slider"></span>
                        </label>
                    </div>

                    <!-- Manual Chat Section -->
                    <div id="manualPanel">
                        <span class="chat-label">1. Choose a Contact (Manual Mode):</span>
                        <select id="contactSelect">
                            <option value="">Fetching contacts...</option>
                        </select>
                        
                        <span class="chat-label">2. Type your message:</span>
                        <span class="live-indicator" id="liveIndicator">Websocket Active 🟢</span>
                        <input type="text" id="messageInput" placeholder="Type a message..." onkeypress="handleKeyPress(event)" disabled>
                        
                        <button onclick="sendMessage()" id="sendBtn" disabled>Send Manual Message</button>
                        <div id="sendResult"></div>
                    </div>
                </div>
            </div>

            <script>
                const socket = io();
                const qrcodeContainer = document.getElementById('qrcode');
                const statusText = document.getElementById('statusText');
                const chatInterface = document.getElementById('chatInterface');
                
                const aiToggle = document.getElementById('aiToggle');
                const manualPanel = document.getElementById('manualPanel');
                const contactSelect = document.getElementById('contactSelect');
                const msgInput = document.getElementById('messageInput');
                const sendBtn = document.getElementById('sendBtn');
                const resDiv = document.getElementById('sendResult');
                const liveIndicator = document.getElementById('liveIndicator');
                
                let qrCodeObj = null;
                let currentAiState = false;

                function showConnected() {
                    qrcodeContainer.style.display = 'none';
                    statusText.innerHTML = '<span class="success">✅ Connected to WhatsApp!</span>';
                    chatInterface.style.display = 'block';
                    qrCodeObj = null;
                    socket.emit('get_contacts');
                }

                function showQR(qrText) {
                    qrcodeContainer.style.display = 'flex';
                    chatInterface.style.display = 'none';
                    statusText.innerHTML = 'Scan this QR code with your WhatsApp app.';
                    if (!qrCodeObj) {
                        qrcodeContainer.innerHTML = '';
                        qrCodeObj = new QRCode(qrcodeContainer, {
                            text: qrText, width: 256, height: 256,
                            colorDark : "#000000", colorLight : "#ffffff", correctLevel : QRCode.CorrectLevel.M
                        });
                    } else {
                        qrCodeObj.clear();
                        qrCodeObj.makeCode(qrText);
                    }
                }

                // --- AI TOGGLE LOGIC ---
                function toggleAiMode() {
                    currentAiState = aiToggle.checked;
                    socket.emit('toggle_ai', currentAiState);
                    updateUIBasedOnAiState();
                }

                socket.on('ai_status_update', (state) => {
                    currentAiState = state;
                    aiToggle.checked = currentAiState;
                    updateUIBasedOnAiState();
                });

                function updateUIBasedOnAiState() {
                    if (currentAiState) {
                        manualPanel.style.opacity = '0.4';
                        msgInput.disabled = true;
                        sendBtn.disabled = true;
                        contactSelect.disabled = true;
                        liveIndicator.innerHTML = 'AI is taking control of replies... 🤖';
                        liveIndicator.style.color = '#128C7E';
                    } else {
                        manualPanel.style.opacity = '1';
                        contactSelect.disabled = false;
                        const hasContact = contactSelect.value !== '';
                        msgInput.disabled = !hasContact;
                        sendBtn.disabled = !hasContact;
                        liveIndicator.innerHTML = 'Manual Mode Active 🟢';
                        liveIndicator.style.color = '#888';
                    }
                }
                // ------------------------

                socket.on('status_update', (data) => {
                    if (data.authenticated) showConnected();
                    else if (data.qr) showQR(data.qr);
                    else statusText.innerHTML = 'Generating QR code...';
                });

                socket.on('qr', showQR);
                socket.on('ready', showConnected);
                socket.on('disconnected', () => {
                    chatInterface.style.display = 'none';
                    statusText.innerHTML = '<span style="color:red">Session disconnected. Awaiting new QR...</span>';
                });

                socket.on('contacts_list', (contacts) => {
                    contactSelect.innerHTML = '<option value="">-- Choose a Contact --</option>';
                    contacts.forEach(c => {
                        const opt = document.createElement('option');
                        opt.value = c.id;
                        opt.textContent = c.name + ' (' + c.number + ')';
                        contactSelect.appendChild(opt);
                    });
                });

                contactSelect.addEventListener('change', () => {
                    if (!currentAiState) {
                        const hasContact = contactSelect.value !== '';
                        msgInput.disabled = !hasContact;
                        sendBtn.disabled = !hasContact;
                    }
                });

                socket.on('message_status', (data) => {
                    resDiv.innerHTML = data.text;
                    if (data.status === 'success') {
                        resDiv.style.color = '#25D366';
                        if(!currentAiState) sendBtn.disabled = false;
                        msgInput.value = '';
                        setTimeout(() => { if (resDiv.innerHTML.includes('✅')) resDiv.innerHTML = ''; }, 4000);
                    } else if (data.status === 'error') {
                        resDiv.style.color = 'red';
                        if(!currentAiState) sendBtn.disabled = false;
                    } else {
                        resDiv.style.color = '#555';
                        sendBtn.disabled = true;
                    }
                });

                let typingTimeout;
                msgInput.addEventListener('input', () => {
                    if (currentAiState) return;
                    const targetId = contactSelect.value;
                    if (!targetId) return;
                    
                    liveIndicator.innerHTML = 'You are typing on WhatsApp... ✍️';
                    liveIndicator.style.color = '#25D366';
                    
                    socket.emit('user_typing', { targetId });
                    
                    clearTimeout(typingTimeout);
                    typingTimeout = setTimeout(() => {
                        socket.emit('user_stopped_typing', { targetId });
                        liveIndicator.innerHTML = 'Manual Mode Active 🟢';
                        liveIndicator.style.color = '#888';
                    }, 2000);
                });

                function handleKeyPress(e) {
                    if (e.key === 'Enter' && !sendBtn.disabled) sendMessage();
                }

                function sendMessage() {
                    const msg = msgInput.value.trim();
                    const targetId = contactSelect.value;
                    if (!msg || !targetId) return;
                    
                    clearTimeout(typingTimeout);
                    socket.emit('user_stopped_typing', { targetId });
                    liveIndicator.innerHTML = 'Manual Mode Active 🟢';
                    liveIndicator.style.color = '#888';
                    
                    socket.emit('send_message', { targetId, message: msg });
                }
            </script>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`WhatsApp Live Agent running on port ${PORT}`);
    console.log(`🌐 Web Dashboard is live at: http://localhost:${PORT}`);
});
