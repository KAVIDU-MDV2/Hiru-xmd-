const { cmd } = require('../command')
const { isUrl } = require('../lib/functions')

cmd({
    pattern: "follow",
    react: "📲",
    alias: ["chfollow", "followch","chf"],
    desc: "Follow a WhatsApp Channel using invite link",
    category: "channel",
    use: '.follow < Channel Link >',
    filename: __filename
}, async (conn, mek, m, {
    from,
    quoted,
    q,
    isCreator,
    reply
}) => {
    try {
        const msr = {
            own_cmd: "You don't have permission to use this command."
        };

        // Only owner/creator can use this command
        if (!isCreator) return reply(msr.own_cmd);

        // Check for input
        if (!q && !quoted) return reply("*Please provide the Channel Link* 📎");

        let chLink;

        // Extract link from quoted message or from input
        if (quoted && quoted.type === 'conversation' && isUrl(quoted.text)) {
            chLink = quoted.text.split('https://whatsapp.com/channel/')[1];
        } else if (q && isUrl(q)) {
            chLink = q.split('https://whatsapp.com/channel/')[1];
        }

        if (!chLink) return reply("❌ *Invalid Channel Link*");

        // Try to join the channel using invite code
        await conn.groupAcceptInvite(chLink);

        await conn.sendMessage(from, {
            text: `✔️ *Successfully Followed the Channel!*`
        }, {
            quoted: mek
        });

    } catch (e) {
        await conn.sendMessage(from, {
            react: {
                text: '❌',
                key: mek.key
            }
        });
        console.log(e);
        reply(`❌ *Couldn't Follow Channel!*\n\n${e}`);
    }
});
