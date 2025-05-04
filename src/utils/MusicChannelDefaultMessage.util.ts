import { EmbedBuilder } from "discord.js";
import { config } from "../config/config";

export default class MusicChannelDefaultMessage {
    defaultTrackEmbedMessage(): EmbedBuilder {
        const embed: EmbedBuilder = new EmbedBuilder()
            .setColor(config.assets.musicChannel.defaultColor)
            .setTitle('ยังไม่มีเพลงเล่นอยู่ ณ ตอนนี้')
            .setImage(`${config.assets.musicChannel.defaultUrl}`)
            .setFooter({ 
                text: `ใช้ /help สำหรับคำสั่งเพิ่มเติม`
            })
            .setTimestamp();
        return embed;
    }

    defaultQueueMessage(): string {
        return '**คิวเพลง:**\nเข้าช่องเสียง และพิมพ์ชื่อเพลงหรือลิงก์ของเพลง เพื่อเปิดเพลงน่ะ';
    }
}