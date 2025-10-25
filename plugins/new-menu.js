const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

cmd({
    pattern: "menu",
    desc: "Show interactive menu system",
    category: "menu",
    react: "🧾",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Get Sri Lanka time
        const date = new Date();
        const timeString = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Colombo',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date);

        // Greeting in Sinhala based on Sri Lanka time
        const hourNumber = parseInt(new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Colombo',
            hour: '2-digit',
            hour12: false
        }).format(date));

        let greeting = "සුභ රත්‍රියක්!";
        if (hourNumber < 12) greeting = "සුභ උදෑසනක්!";
        else if (hourNumber < 18) greeting = "සුභ සැන්දෑවක!";

        const senderName = m.pushName || "User";

        // Menu caption with dynamic info
        const menuCaption = `╭━━━〔 *𝐇𝐈𝐑𝐔_𝐗_𝐌𝐃* 〕━━━┈⊷
┃❄️┋🙋 *User:* ${senderName}
┃❄️┋⏰ *Local Time :* ${timeString}
┃❄️┋💬 *Greeting:* ${greeting}
╰━━━━━━━━━━━━━━━┈⊷
╭━━━━━━━━━━━━━━━━┈⊷
┃❄️┋⚙️ *Bot Info*
┃❄️┋├ Owner: *Hirun*
┃❄️┋├ Baileys: *Multi Device*
┃❄️┋├ Type: *NodeJs*
┃❄️┋├ Platform:*GITHUB*
┃❄️┋├ Mode: *[${config.MODE}]*
┃❄️┋├ Prefix: *[${config.PREFIX}]*
┃❄️┋└ Version:*1.0.0*
╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
❒ *ᴛʜᴇ ʜɪʀᴜ-x-ᴍᴅ ᴡᴀ ʙᴏᴛ*

  *╭━━〔 𝐇𝐈𝐑𝐔_𝐗_𝐌𝐃 𝐌𝐄𝐍𝐔 🥷🇱🇰 〕━━○●➣*
  *╭───━━───━━─●◎➣*
  *┃🍃┋➊.➣ ᴅᴏᴡɴʟᴏᴀᴅ ᴍᴇɴᴜ 📥* 
  *┃🍃┋❷.➣ ɢʀᴏᴜᴩ ᴍᴇɴᴜ 👥* 
  *┃🍃┋❸.➣ ꜰᴜɴ ᴍᴇɴᴜ 🤖*
  *┃🍃┋❹.➣ ᴏᴡɴᴇʀ ᴍᴇɴᴜ 🕵🏻‍♀️*
  *┃🍃┋➎.➣ ᴀɪ ᴍᴇɴᴜ 👾*
  *┃🍃┋❻.➣ ᴀɴɪᴍᴇ ᴍᴇɴᴜ 🚀*
  *┃🍃┋➐.➣ ᴄᴏɴᴠᴇʀᴛ ᴍᴇɴᴜ 🔃*
  *┃🍃┋❽.➣ ᴏᴛʜᴇʀ ᴍᴇɴᴜ 😉*
  *┃🍃┋❾.➣ʀᴇᴀᴄᴛɪᴏɴꜱ ᴍᴇɴᴜ 🤍*
  *┃🍃┋❿.➣ᴍᴀɪɴ ᴍᴇɴᴜ 🏡*
  *┃🍃┋❶❶.➣ʟᴏɢᴏ ᴍᴇɴᴜ   🌠*
  *╰─────●◎➣*
  *╰─━──━─━────●◎➣*

> *ᴩᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜɴ ᴠɪᴋᴀꜱɪᴛʜᴀ*🥷🇱🇰
╰━━━━━━━━━━━━━━━┈⊷`;

        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363418953677198@newsletter',
                newsletterName: '𝗛𝗜𝗥𝗨 𝗫 𝗠𝗗',
                serverMessageId: 143
            }
        };

        // Function to send menu video with timeout
        const sendMenuVideo = async () => {
            try {
                return await conn.sendMessage(
                    from,
                    {
                        video: { url: 'https://files.catbox.moe/0945ke.mp4' },
                        mimetype: 'video/mp4', // Correct property name
                        ptv: true // Set PTV to true for WhatsApp video message
                    },
                    { quoted: mek }
                );
            } catch (e) {
                console.log('Video send failed, continuing without it:', e);
                throw e; // Let the error propagate to fallback to image
            }
        };

        // Function to send menu image with timeout
        const sendMenuImage = async () => {
            try {
                return await conn.sendMessage(
                    from,
                    {
                        image: { url: 'https://files.catbox.moe/38edxu.jpg' },
                        caption: menuCaption,
                        contextInfo: contextInfo
                    },
                    { quoted: mek }
                );
            } catch (e) {
                console.log('Image send failed, falling back to text:', e);
                return await conn.sendMessage(
                    from,
                    { text: menuCaption, contextInfo: contextInfo },
                    { quoted: mek }
                );
            }
        };

        

        // Send video, then image, then audio sequentially
        let sentMsg;
        try {
            // Send video with 12s timeout
            await Promise.race([
                sendMenuVideo(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Video send timeout')), 12000))
            ]);

            // Send image with 10s timeout
            sentMsg = await Promise.race([
                sendMenuImage(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Image send timeout')), 10000))
            ]);

            // Then send audio with 1s delay and 8s timeout
            await Promise.race([
                sendMenuAudio(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Audio send timeout')), 8000))
            ]);
        } catch (e) {
            console.log('Menu send error:', e);
            if (!sentMsg) {
                sentMsg = await conn.sendMessage(
                    from,
                    { text: menuCaption, contextInfo: contextInfo },
                    { quoted: mek }
                );
            }
        }

        const messageID = sentMsg.key.id;

        // Menu data (complete version)
        const menuData = {
            '1': {
                title: "📥 *Download Menu* 📥",
                content: `╭━━━〔 *Download Menu* 〕━━━┈⊷
┃ヤ│ • facebook [url]
┃ヤ│ • mediafire [url]
┃ヤ│ • tiktok [url]
┃ヤ│ • twitter [url]
┃ヤ│ • Insta [url]
┃ヤ│ • apk [app]
┃ヤ│ • img [query]
┃ヤ│ • tt2 [url]
┃ヤ│ • pins [url]
┃ヤ│ • apk2 [app]
┃ヤ│ • fb2 [url]
┃ヤ│ • pinterest [url]
┃ヤ│ • spotify [query]
┃ヤ│ • play [song]
┃ヤ│ • play2-10 [song]
┃ヤ│ • audio [url]
┃ヤ│ • video [url]
┃ヤ│ • video2-10 [url]
┃ヤ│ • ytmp3 [url]
┃ヤ│ • ytmp4 [url]
┃ヤ│ • song [name]
┃ヤ│ • darama [name]
┃ヤ│ • define
┃ヤ│ • lyric
┃ヤ│ • tiktokstalk
┃ヤ│ • xstalk
┃ヤ│ • yts
┃ヤ│ • ytstalk
┃ヤ│ • asong
┃ヤ│ • ytsdu
┃ヤ│ • fb
┃ヤ│ • ig
┃ヤ│ • twitter
┃ヤ│ • mediafire
┃ヤ│ • gdrive
┃ヤ│ • modapk
┃ヤ│ • pair
┃ヤ│ • clonebot
┃ヤ│ • pindl
┃ヤ│ • tts
┃ヤ│ • video3
┃ヤ│ • play3
┃ヤ│ • csong1
┃ヤ│ • play3
┃ヤ│ • ytpost
┃ヤ│ • gitclone
┃ヤ│ • tiktok2
┃ヤ│ • movie2
┃ヤ│ • video7
┃ヤ│ • rw
┃ヤ│ • convert
┃ヤ│ • pmp4
┃ヤ│ • tomp3
┃ヤ│ • toptt
┃ヤ│ • ytsplay
╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> *ᴩᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜɴ ᴠɪᴋᴀꜱɪᴛʜᴀ*🥷🇱🇰*`,
                image: true
            },
            '2': {
                title: "👥 *Group Menu* 👥",
                content: `╭━━━〔 *Group Menu* 〕━━━┈⊷
┃ヤ│ • grouplink
┃ヤ│ • kickall
┃ヤ│ • kickall2
┃ヤ│ • kickall3
┃ヤ│ • add @user
┃ヤ│ • remove @user
┃ヤ│ • kick @user
┃ヤ│ • promote @user
┃ヤ│ • demote @user
┃ヤ│ • dismiss 
┃ヤ│ • revoke
┃ヤ│ • mute [time]
┃ヤ│ • unmute
┃ヤ│ • lockgc
┃ヤ│ • unlockgc
┃ヤ│ • tag @user
┃ヤ│ • hidetag [msg]
┃ヤ│ • tagall
┃ヤ│ • tagadmins
┃ヤ│ • invite
┃ヤ│ • check
┃ヤ│ • requestlist
┃ヤ│ • acceptall
┃ヤ│ • rejectall
┃ヤ│ • updategdesc
┃ヤ│ • updategname
┃ヤ│ • ginfo
┃ヤ│ • join
┃ヤ│ • lockgc
┃ヤ│ • mute
┃ヤ│ • newgc
┃ヤ│ • poll
┃ヤ│ • push
┃ヤ│ • removemembers
┃ヤ│ • removeadmins
┃ヤ│ • removeall2
┃ヤ│ • unlockgc
┃ヤ│ • unmute
┃ヤ│ • antilink
┃ヤ│ • antilinkkick
┃ヤ│ • deletelink
┃ヤ│ • delete
┃ヤ│ • tagadmins
┃ヤ│ • broadcast
┃ヤ│ • couplepp
╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> *ᴩᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜɴ ᴠɪᴋᴀꜱɪᴛʜᴀ*🥷🇱🇰`,
                image: true
            },
            '3': {
                title: "😄 *Fun Menu* 😄",
                content: `╭━━━〔 *Fun Menu* 〕━━━┈⊷
┃ヤ│ • img
┃ヤ│ • ringtone
┃ヤ│ • emix
┃ヤ│ • compatibility
┃ヤ│ • aura
┃ヤ│ • roast
┃ヤ│ • 8ball
┃ヤ│ • compliment
┃ヤ│ • lovetest
┃ヤ│ • emoji
┃ヤ│ • marige
┃ヤ│ • bacha
┃ヤ│ • bachi
┃ヤ│ • ship
┃ヤ│ • animegirl
┃ヤ│ • animegirl1
┃ヤ│ • animegirl2
┃ヤ│ • animegirl3
┃ヤ│ • animegirl4
┃ヤ│ • animegirl5
┃ヤ│ • dog
┃ヤ│ • animegirl8
┃ヤ│ • poke
┃ヤ│ • hug1
┃ヤ│ • hold1
┃ヤ│ • hifi1
┃ヤ│ • waifu1
┃ヤ│ • naruto1
┃ヤ│ • neko2
┃ヤ│ • foxgirl
┃ヤ│ • animenews1
┃ヤ│ • loli
┃ヤ│ • hack
┃ヤ│ • quote
┃ヤ│ • cry
┃ヤ│ • cuddle
┃ヤ│ • bully
┃ヤ│ • hug
┃ヤ│ • awoo
┃ヤ│ • lick
┃ヤ│ • pat
┃ヤ│ • smug
┃ヤ│ • bonk
┃ヤ│ • yeet
┃ヤ│ • blush
┃ヤ│ • handhold
┃ヤ│ • highfive
┃ヤ│ • nom
┃ヤ│ • wave
┃ヤ│ • smile
┃ヤ│ • wink
┃ヤ│ • happy
┃ヤ│ • glomp
┃ヤ│ • bite
┃ヤ│ • poke
┃ヤ│ • cringe
┃ヤ│ • dance
┃ヤ│ • kill
┃ヤ│ • slap
┃ヤ│ • kiss
┃ヤ│ • roll
┃ヤ│ • coinflip
┃ヤ│ • flip
┃ヤ│ • pick
┃ヤ│ • shapar
┃ヤ│ • rate
┃ヤ│ • joke
┃ヤ│ • filrt
┃ヤ│ • truth
┃ヤ│ • dare
┃ヤ│ • fact
┃ヤ│ • pickupline
┃ヤ│ • character
┃ヤ│ • repeat
┃ヤ│ • send
┃ヤ│ • tts2
┃ヤ│ • tts3
╰━━━━━━━━━━━━━━━┈⊷
 > *ᴩᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜɴ ᴠɪᴋᴀꜱɪᴛʜᴀ*🥷🇱🇰`,
                image: true
            },
            '4': {
                title: "👑 *Owner Menu* 👑",
                content: `╭━━━〔 *Owner Menu* 〕━━━┈⊷
┃╭──────────────
┃ヤ│ • block @user
┃ヤ│ • unblock @user
┃ヤ│ • fullpp [img]
┃ヤ│ • setpp [img]
┃ヤ│ • restart
┃ヤ│ • shutdown
┃ヤ│ • updatecmd 
┃ヤ│ • gjid
┃ヤ│ • jid @user
┃ヤ│ • listcmd
┃ヤ│ • allmenu
┃ヤ│ • forwarded 
┃ヤ│ • vv
┃ヤ│ • vv2
┃ヤ│ • chr1
┃ヤ│ • chreact
┃ヤ│ • admin
┃ヤ│ • leave
┃ヤ│ • leave2
┃ヤ│ • shutdown
┃ヤ│ • broadcast
┃ヤ│ • setpp4
┃ヤ│ • setgpp
┃ヤ│ • clearchats
┃ヤ│ • gjid
┃ヤ│ • getpp
┃ヤ│ • countx
┃ヤ│ • count
┃ヤ│ • spam
╰━━━━━━━━━━━━━━━┈⊷
> *ᴩᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜɴ ᴠɪᴋᴀꜱɪᴛʜᴀ*🥷🇱🇰`,
                image: true
            },
            '5': {
                title: "🤖 *AI Menu* 🤖",
                content: ` ╭━━━〔 *AI Menu* 〕━━━┈⊷
┃ヤ│ • ai [query]
┃ヤ│ • gpt4 [query]
┃ヤ│ • deepseek [query]
┃ヤ│ • aiimg [text]
┃ヤ│ • aiimg2 [text]
┃ヤ│ • aiimg3 [text]
╰━━━━━━━━━━━━━━━┈⊷
> *ᴩᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜɴ ᴠɪᴋᴀꜱɪᴛʜᴀ*🥷🇱🇰`,
                image: true
            },
            '6': {
                title: "🎎 *Anime Menu* 🎎",
                content: `╭━━━〔 *Anime Menu* 〕━━━┈⊷
┃ヤ│ • girl
┃ヤ│ • waifu
┃ヤ│ • neko
┃ヤ│ • megumin
┃ヤ│ • maid
┃ヤ│ • awoo
┃ヤ│ • fack
┃ヤ│ • dog
┃ヤ│ • animegirl1
┃ヤ│ • animegirl2
┃ヤ│ • animegirl3
┃ヤ│ • animegirl4
┃ヤ│ • animegirl5
┃ヤ│ • anime1
┃ヤ│ • anime2
┃ヤ│ • anime3
┃ヤ│ • anime4
┃ヤ│ • anime5
┃ヤ│ • foxgirl
┃ヤ│ • naruto
┃ヤ│ • loli
┃ヤ│ • garl
╰━━━━━━━━━━━━━━━┈⊷
> *ᴩᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜɴ ᴠɪᴋᴀꜱɪᴛʜᴀ*🥷🇱🇰`,
                image: true
            },
            '7': {
                title: "🔄 *Convert Menu* 🔄",
                content: `╭━━━〔 *Convert Menu* 〕━━━┈⊷
┃ヤ│ • sticker [img]
┃ヤ│ • sticker2 [img]
┃ヤ│l • emojimix 😎+😂
┃ヤ│ • take [name,text]
┃ヤ│ • tomp3 [video]
┃ヤ│ • fancy [text]
┃ヤ│ • tts [text]
┃ヤ│ • trt [text]
┃ヤ│ • base64 [text]
┃ヤ│ • unbase64 [text]
┃ヤ│ • npm
┃ヤ│ • npm2
┃ヤ│ • tiny
┃ヤ│ • attp
┃ヤ│ • readmore
╰━━━━━━━━━━━━━━━┈⊷
> *ᴩᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜɴ ᴠɪᴋᴀꜱɪᴛʜᴀ*🥷🇱🇰*`,
                image: true
            },
            '8': {
                title: "📌 *Other Menu* 📌",
                content: `╭━━━〔 *Other Menu* 〕━━━┈⊷
╭──────────────
┃ヤ│ • timenow
┃ヤ│ • date
┃ヤ│ • count 
┃ヤ│ • calculate 
┃ヤ│ • countx
┃ヤ│ • flip
┃ヤ│ • coinflip
┃ヤ│ • rcolor
┃ヤ│ • roll
┃ヤ│ • fact
┃ヤ│ • define 
┃ヤ│ • news 
┃ヤ│ • movie 
┃ヤ│ • weather 
┃ヤ│ • channelreact
┃ヤ│ • gpass
┃ヤ│ • anime1
┃ヤ│ • anime2
┃ヤ│ • anime3
┃ヤ│ • anime4
┃ヤ│ • anime5
┃ヤ│ • srepo
┃ヤ│ • trt
┃ヤ│ • update
┃ヤ│ • antidelete
┃ヤ│ • vv3
┃ヤ│ • follow
┃ヤ│ • version
┃ヤ│ • owner1
┃ヤ│ • repo
┃ヤ│ • countryinfo
┃ヤ│ • cjid1
┃ヤ│ • jid
┃ヤ│ • imgscan
┃ヤ│ • caption
┃ヤ│ • send
┃ヤ│ • rcolor
┃ヤ│ • binary
┃ヤ│ • dbinary
┃ヤ│ • base64
┃ヤ│ • unbase64
┃ヤ│ • urlencod
┃ヤ│ • urldecode
┃ヤ│ • timenow2
┃ヤ│ • timenow
┃ヤ│ • date
┃ヤ│ • person
┃ヤ│ • profile
┃ヤ│ • msg
┃ヤ│ • report
┃ヤ│ • tourl
┃ヤ│ • wstalk
┃ヤ│ • happy
┃ヤ│ • heart
┃ヤ│ • angry
┃ヤ│ • sad
┃ヤ│ • shy
┃ヤ│ • moon
┃ヤ│ • confused
┃ヤ│ • hot
┃ヤ│ • nikal
┃ヤ│ • heart2
┃ヤ│ • fancy
┃ヤ│ • spam
┃ヤ│ • spam3
┃ヤ│ • statue
┃ヤ│ • tempnum
┃ヤ│ • templist
┃ヤ│ • otpbox
┃ヤ│ • ad
┃ヤ│ • adedit
┃ヤ│ • blur
┃ヤ│ • grey
┃ヤ│ • invert
┃ヤ│ • gail
┃ヤ│ • imgjoke
┃ヤ│ • nokia
┃ヤ│ • wanted
┃ヤ│ • rmbg
┃ヤ│ • film
┃ヤ│ • movie2
┃ヤ│ • video7
┃ヤ│ • rw
┃ヤ│ • take
┃ヤ│ • sticker
┃ヤ│ • vsticker
┃ヤ│ • tsticker ╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> *ᴩᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜɴ ᴠɪᴋᴀꜱɪᴛʜᴀ*🥷🇱🇰*`,
                image: true
            },
            '9': {
                title: "💞 *Reactions Menu* 💞",
                content: `╭━━━〔 *Reactions Menu* 〕━━━┈⊷
┃ヤ│ • cuddle @user
┃ヤ│ • hug @user
┃ヤ│ • kiss @user
┃ヤ│ • lick @user
┃ヤ│ • pat @user
┃ヤ│ • bully @user
┃ヤ│ • bonk @user
┃ヤ│ • yeet @user
┃ヤ│ • slap @user
┃ヤ│ • kill @user
┃ヤ│ • blush @user
┃ヤ│ • smile @user
┃ヤ│ • happy @user
┃ヤ│ • wink @user
┃ヤ│ • poke @user
╰━━━━━━━━━━━━━━━┈⊷
> *ᴩᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜɴ ᴠɪᴋᴀꜱɪᴛʜᴀ*🥷🇱🇰*`,
                image: true
            },
            '10': {
                title: "🏠 *Main Menu* 🏠",
                content: `╭━━━〔 *Main Menu* 〕━━━┈⊷
┃ヤ╭──────────────
┃ヤ│ • ping
┃ヤ│ • ping2
┃ヤ│ • ping3
┃ヤ│ • ping4
┃ヤ│ • live
┃ヤ│ • alive
┃ヤ│ • runtime
┃ヤ│ • uptime
┃ヤ│ • repo
┃ヤ│ • owner
┃ヤ│ • menu
┃ヤ│ • menu2
┃ヤ│ • restart
┃ヤ│ • xvideo
┃ヤ│ • online
┃ヤ│ • anime
┃ヤ│ • fluxai
┃ヤ│ • stablediffusion
┃ヤ│ • stabilityai
┃ヤ│ • fetch
┃ヤ│ • aivoice
┃ヤ│ • mp4
┃ヤ│ • song2
┃ヤ│ • sndsong
┃ヤ│ • stopsong
┃ヤ│ • song6
┃ヤ│ • yts4 ╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> *ᴩᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜɴ ᴠɪᴋᴀꜱɪᴛʜᴀ*🥷🇱🇰`,
                image: true
            },
            '11': {
                title: "🔳 *Logo Menu* 🔳",
                content: `╭━━━〔 *Logo Menu* 〕━━━┈⊷
┃ヤ│ • 3dcomic
┃ヤ│ • dragonball
┃ヤ│ • deadpool
┃ヤ│ • blackpink
┃ヤ│ • neonlight
┃ヤ│ • cat
┃ヤ│ • sadgirl
┃ヤ│ • pornhub
┃ヤ│ • naruto
┃ヤ│ • thor
┃ヤ│ • america
┃ヤ│ • eraser
┃ヤ│ • 3dpaper
┃ヤ│ • futuristic
┃ヤ│ • clouds
┃ヤ│ • sans
┃ヤ│ • galaxy
┃ヤ│ • leaf
┃ヤ│ • sunset
┃ヤ│ • nigeria
┃ヤ│ • devilwings
┃ヤ│ • hacker
┃ヤ│ • boom
┃ヤ│ • luxury
┃ヤ│ • zodiac
┃ヤ│ • angelwings
┃ヤ│ • bulb
┃ヤ│ • tatoo
┃ヤ│ • castle
┃ヤ│ • forzen
┃ヤ│ • paint
┃ヤ│ • birthday
┃ヤ│ • typography
┃ヤ│ • bear
┃ヤ│ • valorant
╰━━━━━━━━━━━━━━━┈⊷
> *ᴩᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜɴ ᴠɪᴋᴀꜱɪᴛʜᴀ*🥷🇱🇰`,
                image: true
            }
            
        };

        // Message handler with improved error handling
        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

                const isReplyToMenu = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
                
                if (isReplyToMenu) {
                    const receivedText = receivedMsg.message.conversation || 
                                      receivedMsg.message.extendedTextMessage?.text;
                    const senderID = receivedMsg.key.remoteJid;

                    if (menuData[receivedText]) {
                        const selectedMenu = menuData[receivedText];
                        
                        try {
                            if (selectedMenu.image) {
                                await conn.sendMessage(
                                    senderID,
                                    {
                                        image: { url: 'https://files.catbox.moe/38edxu.jpg' },
                                        caption: selectedMenu.content,
                                        contextInfo: contextInfo
                                    },
                                    { quoted: receivedMsg }
                                );
                            } else {
                                await conn.sendMessage(
                                    senderID,
                                    { text: selectedMenu.content, contextInfo: contextInfo },
                                    { quoted: receivedMsg }
                                );
                            }

                            await conn.sendMessage(senderID, {
                                react: { text: '✅', key: receivedMsg.key }
                            });

                        } catch (e) {
                            console.log('Menu reply error:', e);
                            await conn.sendMessage(
                                senderID,
                                { text: selectedMenu.content, contextInfo: contextInfo },
                                { quoted: receivedMsg }
                            );
                        }

                    } else {
                        await conn.sendMessage(
                            senderID,
                            {
                                text: `❌ *Invalid Option!* ❌\n\nPlease reply with a number between 0-10 to select a menu.\n\n*Example:* Reply with "1" for Group Menu\n\n> *ᴩᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜɴ ᴠɪᴋᴀꜱɪᴛʜᴀ*🥷🇱🇰`,
                                contextInfo: contextInfo
                            },
                            { quoted: receivedMsg }
                        );
                    }
                }
            } catch (e) {
                console.log('Handler error:', e);
            }
        };

        // Add listener
        conn.ev.on("messages.upsert", handler);

        // Remove listener after 5 minutes
        setTimeout(() => {
            conn.ev.off("messages.upsert", handler);
        }, 300000);

    } catch (e) {
        console.error('Menu Error:', e);
        try {
            await conn.sendMessage(
                from,
                { text: `❌ Menu system is currently busy. Please try again later.\n\n> *> *ᴩᴏᴡᴇʀᴇᴅ ʙʏ ʜɪʀᴜɴ ᴠɪᴋᴀꜱɪᴛʜᴀ*🥷🇱🇰` },
                { quoted: mek }
            );
        } catch (finalError) {
            console.log('Final error handling failed:', finalError);
        }
    }
});
