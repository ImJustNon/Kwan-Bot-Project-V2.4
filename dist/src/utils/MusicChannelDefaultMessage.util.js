"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("../config/config");
class MusicChannelDefaultMessage {
    defaultTrackEmbedMessage() {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(config_1.config.assets.musicChannel.defaultColor)
            .setTitle('ยังไม่มีเพลงเล่นอยู่ ณ ตอนนี้')
            .setImage(`${config_1.config.assets.musicChannel.defaultUrl}`)
            .setFooter({
            text: `ใช้ /help สำหรับคำสั่งเพิ่มเติม`
        })
            .setTimestamp();
        return embed;
    }
    defaultQueueMessage() {
        return '**คิวเพลง:**\nเข้าช่องเสียง และพิมพ์ชื่อเพลงหรือลิงก์ของเพลง เพื่อเปิดเพลงน่ะ';
    }
}
exports.default = MusicChannelDefaultMessage;
//# sourceMappingURL=MusicChannelDefaultMessage.util.js.map