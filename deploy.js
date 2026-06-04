/* Channel: @troshhhx */
const axios = require("axios");
const bots = {};
const db = {};

const TROSHXC = `
▀█▀ █▀█ █▀█ █▀ █░█
░█░ █▀▄ █▄█ ▄█ █▀█`;

async function processToken(chatId, token, index, total, statusMsgId) {
    try {
        const res = await axios.get(`https://api.telegram.org/bot${token}/getMe`);
        if (!res.data.ok) throw new Error("Token tidak valid");
        if (!bots[token]) {
            const trosh = new TelegramBot(token, { polling: true });
            trosh.onText(/\/start/, async (m) => {
                const text = db[token]?.start || TROSHXC;
                try {
                    await trosh.sendMessage(m.chat.id, photo, {
                        caption: text,
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "CHANNEL", url: "https://t.me/troshhhx", style: "primary" }]
                            ]
                        }
                    });
                } catch (err) {
                    await trosh.sendMessage(m.chat.id, text, {
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "CHANNEL", url: "https://t.me/troshhhx", style: "primary" }]
                            ]
                        }
                    });
                }
            });
            trosh.onText(/\/menu/, async (m) => {
                const text = db[token]?.start || TROSHXC;
                try {
                    await trosh.sendMessage(m.chat.id, text, {
                        caption: text,
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "CHANNEL", url: "https://t.me/troshhhx", style: "danger" }]
                            ]
                        }
                    });
                } catch (err) {
                    await trosh.sendMessage(m.chat.id, text, {
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "CHANNEL", url: "https://t.me/troshhhx", style: "danger" }]
                            ]
                        }
                    });
                }
            });
            trosh.on("polling_error", (err) => {});
            bots[token] = trosh;
        }
        if (!db[token]) {
            db[token] = { start: TROSHXC };
        }
        const currentText = `[TROSH] Berhasil: ${index}/${total}`;
        await bot.editMessageText(currentText, {
            chat_id: chatId,
            message_id: statusMsgId
        });
        return true;
    } catch (e) {
        const errorText = `Gagal: ${token.substring(0, 15)}`;
        await bot.editMessageText(errorText, {
            chat_id: chatId,
            message_id: statusMsgId
        });
        return false;
    }
}

bot.onText(/^\/setbot$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const replyToMsgId = msg.reply_to_message?.message_id;
    if (!replyToMsgId) {
        return bot.sendMessage(chatId, "[TROSH] Reply ke pesan yang berisi daftar token");
    }
    const repliedMsg = msg.reply_to_message;
    const tokenText = repliedMsg.text;
    if (!tokenText) {
        return bot.sendMessage(chatId, "[TROSH] Pesan yang direply tidak mengandung teks token");
    }
    const tokens = tokenText.split("\n").filter(line => line.trim().length > 0);
    if (tokens.length === 0) {
        return bot.sendMessage(chatId, "[TROSH] Tidak ada token yang ditemukan");
    }
    const statusMsg = await bot.sendMessage(chatId, `🔄 Memproses ${tokens.length} token...`);
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i].trim();
        await processToken(chatId, token, i + 1, tokens.length, statusMsg.message_id);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    await bot.editMessageText(`[TROSH] Selesai Mengrasuk ${tokens.length} token.`, {
        chat_id: chatId,
        message_id: statusMsg.message_id
    });
});
