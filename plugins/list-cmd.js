const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "list",
    alias: ["listcmd", "commands"],
    desc: "Show all available commands with descriptions",
    category: "menu",
    react: "📜",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const totalCommands = commands.length;
        let aliasCount = 0;
        commands.forEach(cmd => {
            if (cmd.alias) aliasCount += cmd.alias.length;
        });

        const categories = [...new Set(commands.map(c => c.category))];
        let menuText = `╭───〔 *HIRU X MD - COMMAND LIST* 〕───⬣
│
│ 🤖 *Bot Name:* HIRU X MD
│ 👑 *Owner:* hirun vikashitha
│ ⚙️ *Prefix:* [${config.PREFIX}]
│ 🕒 *Runtime:* ${runtime(process.uptime())}
│ 📦 *Version:* 1.0.0
│ 🌐 *Platform:* Heroku
│
│ 🔢 *Total Commands:* ${totalCommands}
│ 🔁 *Total Aliases:* ${aliasCount}
│ 🗂️ *Categories:* ${categories.length}
╰──────────────⬣\n`;

        for (const category of categories) {
            const cmds = commands.filter(c => c.category === category);
            menuText += `╭──〔 *${category.toUpperCase()}* 〕──⬣
│ 📂 Commands: ${cmds.length}
`;

            cmds.forEach(c => {
                menuText += `│\n`;
                menuText += `│ 🔸 *.${c.pattern}* - ${c.desc || 'No description'}\n`;
                if (c.alias?.length > 0) {
                    menuText += `│ ⤷ Aliases: ${c.alias.map(a => `.${a}`).join(', ')}\n`;
                }
                if (c.use) {
                    menuText += `│ ⤷ Usage: ${c.use}\n`;
                }
            });

            menuText += `╰──────────────⬣\n\n`;
        }

        menuText += `🧾 *Tip:* Type *${config.PREFIX}help <command>* for detailed usage.\n`;
        menuText += `👨‍💻 *Powered by hirun*`;

        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL || 'https://raw.githubusercontent.com/Chamijd/KHAN-DATA/refs/heads/main/logo/SETTING.jpg' },
                caption: menuText,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error('Command List Error:', e);
        reply(`❌ Error generating command list: ${e.message}`);
    }
});
