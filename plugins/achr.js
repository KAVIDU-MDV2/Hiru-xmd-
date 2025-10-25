const config = require("../config");
const { cmd, commands } = require("../command");
const { fetchJson } = require("../lib/functions");

cmd({
    pattern: "channelreact",
    alias: ["chr3"],
    react: "✅",
    use: ".channelreact <link>,<emoji>",
    desc: "React to a WhatsApp channel message using a message link and emoji",
    category: "other",
    filename: __filename,
},
async (conn, mek, m, {
    q, reply
}) => {
    try {
        if (!q || !q.includes(","))
            return reply("❌ Usage: .channelreact <message_link>,<emoji>\n\nExample:\n.channelreact https://whatsapp.com/channel/1234567890123456/ABCD1234,❤️");

        let [link, emoji] = q.split(",");
        emoji = emoji.trim();
        link = link.trim();

        if (!link.includes("whatsapp.com/channel/") || !emoji)
            return reply("❌ Invalid link or emoji. Please double-check your input.");

        const channelId = link.split('/')[4];
        const messageId = link.split('/')[5];

        if (!channelId || !messageId)
            return reply("❌ Couldn't extract channel or message ID from the link.");

        const res = await conn.newsletterMetadata("invite", channelId);
        if (!res?.id)
            return reply("❌ Failed to get channel metadata. Check if the link is valid and accessible.");

        await conn.newsletterReactMessage(res.id, messageId, emoji);
        reply(`✅ Successfully reacted to the message with ${emoji}`);
    } catch (e) {
        console.error("channelreact error:", e);
        reply("❌ Error occurred:\n" + e.toString());
    }
});
