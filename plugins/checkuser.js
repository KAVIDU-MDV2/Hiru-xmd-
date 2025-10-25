const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
    pattern: "check",
    alias: ["checkuser"],
    react: "🔍",
    desc: "Check user info across groups",
    category: "group",
    use: '.check [number]',
    filename: __filename
}, 
async(conn, mek, m, {
    from, args, reply, participants, isGroup, sender, groupMetadata
}) => {
    try {
        const number = args[0]?.replace(/[^0-9]/g, '');
        if (!number) return reply("❌ Please provide a valid number.\n*Example:* .check +9476xxxxxxx");
        const jid = number + "@s.whatsapp.net";

        // Get profile picture
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(jid, 'image');
        } catch {
            ppUrl = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png'; // default img
        }

        const groups = await conn.groupFetchAllParticipating();
        let commonGroups = [];
        let isPastMember = false;
        let isAdminAnywhere = false;
        let adminInGroups = [];
        let isInCurrentGroup = false;

        for (let groupId in groups) {
            const metadata = groups[groupId];
            const participants = metadata.participants || [];
            const found = participants.find(p => p.id === jid);

            if (found) {
                commonGroups.push(metadata.subject);
                if (found.admin) {
                    isAdminAnywhere = true;
                    adminInGroups.push(metadata.subject);
                }
                if (groupId === from) {
                    isInCurrentGroup = true;
                }
            } else {
                try {
                    const history = await conn.groupMetadata(groupId);
                    if (history && history.participants.some(p => p.id === jid)) {
                        isPastMember = true;
                    }
                } catch {}
            }
        }

        let caption = `*「 User Info Checker 」*\n\n`;
        caption += `*Phone:* +${number}\n`;
        caption += `*In This Group:* ${isInCurrentGroup ? "Yes" : "No"}\n`;
        caption += `*Common Groups:* ${commonGroups.length}\n`;
        caption += commonGroups.length ? `${Groups.map((name, i) => `➡️ ${name}`).join('\n')}` : `➡️ None`;
        caption += `\n\n* Member:* ${isPastMember ? "Yes" : "No"}`;
        caption += `\n*Admin in Any Group:* ${isAdminAnywhere ? "Yes" : "No"}`;
        if (adminInGroups.length) caption += `\n*Admin In:*\n${adminInGroups.map((name, i) => `⭐ ${name}`).join('\n')}`;

        await conn.sendMessage(from, { image: { url: ppUrl }, caption: caption }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply(`❌ *Error Occurred!!*\n\n${e.message}`);
    }
});
