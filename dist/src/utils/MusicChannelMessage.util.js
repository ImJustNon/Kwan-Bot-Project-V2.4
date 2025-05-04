"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const convertTime_util_1 = __importDefault(require("./convertTime.util"));
const config_1 = require("../config/config");
const discord_js_1 = require("discord.js");
class MusicChannelMessage {
    constructor(client, player) {
        this.client = client;
        this.player = player;
    }
    createQueueMessage() {
        let defaultQueueMessage = `**คิวเพลง: [${this.player.queue.size}]**\n`;
        let finalQueueMessage = "";
        for (let i = 0; i < this.player.queue.size; i++) {
            defaultQueueMessage += `> \`${i + 1})\` [${new convertTime_util_1.default().convertTime(this.player.queue.tracks[i].duration)}] - ${this.player.queue.tracks[i].title}\n`;
            if (defaultQueueMessage.length >= 2000) {
                break;
            }
            finalQueueMessage = defaultQueueMessage;
        }
        if (finalQueueMessage.length === 0) {
            return finalQueueMessage = defaultQueueMessage + "ยังไม่รายการคิว";
        }
        else {
            return finalQueueMessage;
        }
    }
    createTrackEmbedMessage() {
        var _a, _b, _c;
        let loopType = 'ปิด';
        if (this.player.loop === "track")
            loopType = 'เพลงเดียว';
        else if (this.player.loop === "queue")
            loopType = 'ทั้งหมด';
        const trackRequester = (_a = JSON.parse(JSON.stringify(this.player.current.requestedBy))) === null || _a === void 0 ? void 0 : _a.id;
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(config_1.config.assets.musicChannel.defaultColor)
            .setTitle(`${this.player.current.title}`)
            .setURL(`${this.player.current.url}`)
            .addFields([
            {
                name: "📫 | เปิดโดย",
                value: `<@${trackRequester}>`,
                inline: true,
            },
            {
                name: "🔄 | Loop",
                value: `\` ${loopType} \``,
                inline: true,
            },
            {
                name: "🔊 | Volume",
                value: `\` ${this.player.volume === 0 ? "ปิดเสียง" : this.player.volume} \``,
                inline: true,
            },
            {
                name: "🚪 | ช่อง",
                value: `<#${this.player.textChannelId}>`,
                inline: true,
            },
            {
                name: "🌍 | Creator",
                value: `\` ${this.player.current.author} \``,
                inline: true,
            },
            {
                name: "⏳ | เวลา",
                value: `\` ${new convertTime_util_1.default().convertTime((_b = this.player.current.duration) !== null && _b !== void 0 ? _b : 0)} \``,
                inline: true,
            },
        ])
            .setImage(`${this.player.current.artworkUrl}`)
            .setFooter({
            text: `${(_c = this.client.user) === null || _c === void 0 ? void 0 : _c.username}`
        })
            .setTimestamp();
        return embed;
    }
}
exports.default = MusicChannelMessage;
//# sourceMappingURL=MusicChannelMessage.util.js.map