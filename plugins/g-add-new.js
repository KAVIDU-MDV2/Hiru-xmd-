const { cmd } = require('../command');

cmd({
    pattern: "add5",
    alias: ["a", "invite"],
    desc: "Adds a member to the group",
    category: "admin",
    react: "➕",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, reply, quoted, senderNumber
}) => {
    // ✅ Only allow in groups
    if (!isGroup) return reply("❌ This command can only be used in groups.");

    // ✅ Only bot owner can use
    const botOwner = conn.user.id.split(":")[0];
    if (senderNumber !== botOwner) {
        return reply("❌ Only the bot owner can use this command.");
    }

    // ✅ Validate number
    if (!q) return reply("✳️ Provide the number to add.\nExample: `.add 94712345678`");
    let number = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

    try {
        // ✅ Attempt to add the user
        const res = await conn.groupParticipantsUpdate(from, [number], "add");

        // ✅ Handle result
        const status = res[0]?.status;

        if (status === 200) {
            reply(`✅ Successfully added @${q}`, { mentions: [number] });
        } else if (status === 403) {
            reply("❌ Can't add user. They might have privacy settings enabled.");
        } else if (status === 409) {
            reply("❌ This user is already in the group.");
        } else {
            reply("❌ Failed to add user. Unknown error.");
        }

    } catch (err) {
        console.error("Add Error:", err);
        reply("⚠️ Error adding the user. Maybe I'm not admin or number is invalid.");
    }
});
