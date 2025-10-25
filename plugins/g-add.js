const { cmd } = require('../command');

cmd({
    pattern: "add6",
    alias: ["a", "invite"],
    desc: "Adds a member to the group",
    category: "admin",
    react: "➕",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, reply, quoted
}) => {
    // ✅ Only allow in groups
    if (!isGroup) return reply("❌ This command can only be used in groups.");

    // ✅ Get the number
    let number;
    if (quoted) {
        number = quoted.sender.split("@")[0];
    } else if (q) {
        number = q.replace(/[^0-9]/g, "");
    } else {
        return reply("❌ Please reply to a user or provide a number.\n\nExample: `.add 94712345678`");
    }

    const jid = `${number}@s.whatsapp.net`;

    try {
        const res = await conn.groupParticipantsUpdate(from, [jid], "add");
        const status = res[0]?.status;

        if (status === 200) {
            reply(`✅ Successfully added @${number}`, { mentions: [jid] });
        } else if (status === 403) {
            reply("❌ Couldn't add. User's privacy settings prevent being added.");
        } else if (status === 408) {
            reply("❌ Number not found on WhatsApp.");
        } else {
            reply("❌ Failed to add the member. They may have left recently or blocked the group.");
        }

    } catch (err) {
        console.error("Add error:", err);
        reply("❌ Error while trying to add user.");
    }
});
