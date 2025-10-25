const { cmd } = require("../command");
const config = require("../config");

cmd({
    pattern: "report",
    alias: ["ask", "bug", "request"],
    desc: "Report a bug or request a feature",
    category: "utility",
    filename: __filename
}, async (conn, mek, m, {
    from, body, command, args, senderNumber, reply
}) => {
    try {
        const devNumbers = ["94702529242", "94703229057"]; // Owner numbers array
        const messageId = m.key.id;
        const reportedMessages = {};

        if (!args.length) {
            return reply(`🔧 *Usage:* ${config.PREFIX}report <your message>\n\n📌 Example:\n${config.PREFIX}report .play command is not responding`);
        }

        if (reportedMessages[messageId]) {
            return reply("⚠️ This message has already been reported.");
        }
        reportedMessages[messageId] = true;

        const time = new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" });
        const reportText = `
📩 *New Bug/Request Received*

👤 *From:* @${m.sender.split("@")[0]} 
🕒 *Time:* ${time}
📜 *Message:* ${args.join(" ")}

━━━━━━━━━━━━━━━
`;

        for (const num of devNumbers) {
            await conn.sendMessage(`${num}@s.whatsapp.net`, {
                text: reportText,
                mentions: [m.sender]
            }, { quoted: m });
        }

        const confirmationText = `✅ *Hi ${m.pushName || "User"}*, your message has been successfully forwarded to the developers!\n📌 Please be patient while we look into your request.`;

        reply(confirmationText);
    } catch (error) {
        console.error(error);
        reply("❌ An unexpected error occurred while processing your report.");
    }
});
