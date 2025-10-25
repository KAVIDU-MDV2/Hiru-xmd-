const { cmd } = require('../command');
const config = require('../config');


cmd({
    pattern: "owner",
    react: "👑",
    desc: "Display full owner and team info with image",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {
        const caption = `
╭─────────────────────━┈⊷
╭━━━〔 𝐇𝐈𝐑𝐔_𝐗_𝐌𝐃 〕━━━┈⊷

│◦ ヤ *_Owner =_* Hirun vikasitha
─────────━┈⊷
│◦ ヤ *_Whatsapp =_* +94702529242
─────────━┈⊷
│◦ ヤ *_Youtube =_* https://www.youtube.com/@Hv.music.official
─────────━┈⊷
│◦ ヤ *_Tik tok =_* tiktok.com/@hv.music.official.tiktok
─────────━┈⊷
│◦ ヤ *_Facebook =_* https://www.facebook.com/share/1DwvG5hR7p/
─────────━┈⊷
│◦ ヤ *_Website =_* https://hiruxmdweb.onrender.com/
─────────━┈⊷
│◦ ヤ *_Gmail =_* hvikasitha03@gmail.com

> *ᴩᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜɴ ᴠɪᴋᴀꜱɪᴛʜᴀ*🥷🇱🇰

╰─────────────────────━┈⊷   `;

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/stpsnv.jpg' },
            caption: caption
        });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { text: `❌ Error: ${error.message}` });
    }
});

