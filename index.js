import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

// 🔥 TRACK ROUTE
app.get("/track", async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      "Unknown";

    let geo = {};
    try {
      const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
      geo = await geoRes.json();
    } catch {}

    const webhook =
      "https://discord.com/api/webhooks/1454051690276851835/CvwbdKRk9pkZSU0XFmp8p609q69zJQTiMSF_xxH0yYiOHaR4eBOvr8M9wGP1dg_jOUAk"; // 🔴 apna webhook daal

    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Visitor Tracker",
        embeds: [
          {
            title: "🌐 New Website Visitor",
            color: 0x00ff99,
            fields: [
              { name: "IP", value: ip, inline: true },
              { name: "Country", value: geo.country_name || "Unknown", inline: true },
              { name: "City", value: geo.city || "Unknown", inline: true },
              { name: "ISP", value: geo.org || "Unknown", inline: false },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Backend running on all interfaces");
});
