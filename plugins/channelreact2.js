const config = require("../config");
const { cmd, commands } = require("../command");
const os = require("os");
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, Func, fetchJson } = require("../lib/functions");

cmd({
    pattern: "chreact",
    alias: ["chr"],
    react: "📕",
    use: ".chreact <link>,<reaction>",
    desc: "React to a message in a Telegram channel using the link.",
    category: "owner",
    filename: __filename,
},
async (conn, mek, m, { reply, q , isOwner }) => {
    try {
        if (!isOwner) return;

        if (!q.includes(',')) return reply("Please provide the input in this format:\n.chreact <link>,<reaction>");

        let link = q.split(",")[0].trim();
        let react = q.split(",")[1].trim();

        const channelId = link.split('/')[4];
        const messageId = link.split('/')[5];

        const res = await conn.newsletterMetadata("invite", channelId);

        const response = await conn.newsletterReactMessage(res.id, messageId, react);

        // If no error thrown, we assume it succeeded
        reply(`✅ Reacted with "${react}" successfully!`);
    } catch (e) {
        console.log(e);
        reply("❌ Error: " + e.message);
    }
});
