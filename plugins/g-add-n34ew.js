const { cmd } = require('../command');

cmd({
    pattern: "add9",
    alias: ["a", "invite"],
    desc: "Adds a member to the group or sends invite link if failed",
    category: "admin",
    react: "➕",
    filename: __filename
}, async (conn, mek, m, {
    from, q, isGroup, reply, quoted, participants
}) => {
    if (!isGroup) return reply("❌ මේ command එක group වලට විතරයි.");

    const sender = m.sender;
    const senderId = sender.endsWith("@s.whatsapp.net") ? sender : sender + "@s.whatsapp.net";

    const groupAdmins = participants.filter(p => p.admin).map(p => p.id);
    const isSenderAdmin = groupAdmins.includes(senderId);

    if (!isSenderAdmin) return reply("❌ ඔයා මේ group එකේ admin කෙනෙක් නෙමෙයි!");

    let number;
    if (m.quoted) {
        number = m.quoted.sender.split("@")[0];
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s+]/g, '');
    } else if (q && /^\d+$/.test(q)) {
        number = q;
    } else {
        return reply("❌ කරුණාකර message එකකට reply කරන්න හෝ number එකක් mention කරන්න.");
    }

    const jid = number + "@s.whatsapp.net";

    try {
        await conn.groupParticipantsUpdate(from, [jid], "add");
        await reply(`✅ @${number} group එකට add කලා!`, { mentions: [jid] });
    } catch (error) {
        console.log("Add failed, sending invite link...");

        try {
            const code = await conn.groupInviteCode(from);
            const groupName = (await conn.groupMetadata(from)).subject;

            await conn.sendMessage(jid, {
                text: `📩 ඔයාව *${groupName}* group එකට add කරන්න බැරි උනා.\nඒක නිසා මෙන්න invite link එක👇\n\nhttps://chat.whatsapp.com/${code}`
            });
            await reply(`❌ Add කරන්න බැරි උනා. Invite link එක එවලා තියෙන්නෙ.`);
        } catch (e) {
            await reply("⚠️ Add කරන්නත් invite link එවන්නත් බැරි උනා!");
        }
    }
});
