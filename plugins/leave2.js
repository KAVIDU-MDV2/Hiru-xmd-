const { sleep } = require('../lib/functions');
const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "leave2",
    alias: ["left2", "leftgc", "leavegc"],
    desc: "Leave group(s) by JID(s)",
    react: "🎉",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply
}) => {
    try {
        const botOwner = conn.user.id.split(":")[0];
        if (senderNumber !== botOwner) {
            return reply("Only the bot owner can use this command.");
        }

        // If used in group without args, leave current group
        if (isGroup && !q) {
            reply("Leaving this group...");
            await sleep(1500);
            await conn.groupLeave(from);
            return reply("Goodbye! 👋");
        }

        // If JIDs are passed like `.left 1203@g.us,1204@g.us`
        const jids = q.split(',').map(jid => jid.trim()).filter(j => j.endsWith('@g.us'));
        if (jids.length === 0) {
            return reply("Please provide valid group JIDs separated by commas.");
        }

        reply(`Leaving ${jids.length} group(s)...`);

        for (const jid of jids) {
            try {
                await conn.groupLeave(jid);
                await sleep(1000); // avoid rate limit
            } catch (err) {
                reply(`❌ Couldn't leave ${jid}: ${err.message}`);
            }
        }

        reply("✅ Done leaving specified groups.");
    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);
    }
});