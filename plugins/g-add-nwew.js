const { cmd } = require('../command');

cmd({
    pattern: "add7",
    alias: ["a", "invite"],
    desc: "Adds a user to the group (only for group admins)",
    category: "admin",
    react: "➕",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, reply, quoted, participants, sender
}) => {

    if (!isGroup) return reply("❌ මේ command එක group වලට විතරක්.");

    const isUserAdmin = participants.some(p => p.id === sender && p.admin !== null);
    if (!isUserAdmin) return reply("❌ ඔයාට මේ group එකේ admin privileges නැහැ.");

    let number;
    if (quoted) {
        number = quoted.sender.split("@")[0];
    } else if (q && q.includes("@")) {
        number = q.replace(/[^0-9]/g, '');
    } else if (/^\d{5,}$/.test(q)) {
        number = q;
    } else {
        return reply("❌ කරුණාකර valid number එකක් mention කරන්න හෝ message එකකට reply කරන්න.");
    }

    const jid = `${number}@s.whatsapp.net`;

    try {
        await conn.groupParticipantsUpdate(from, [jid], "add");
        return reply(`✅ @${number} group එකට add කලා!`, { mentions: [jid] });
    } catch (error) {
        return reply("🚫 Add කරන්න බැරි උනා. ඔයා add කරන්න යනකෙනාට group එකට add වෙන්න option එක support නෑ.");
    }
});
