"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_class_1 = require("../../classes/Event.class");
const discord_js_1 = require("discord.js");
const convertTime_util_1 = __importDefault(require("../../utils/convertTime.util"));
const MusicChannelWebhook_util_1 = __importDefault(require("../../utils/MusicChannelWebhook.util"));
class TrackStart extends Event_class_1.Event {
    constructor(client, file) {
        super(client, file, {
            name: "trackStart",
            type: "player"
        });
    }
    callback(player, track) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const channel = this.client.channels.cache.get(player.textChannelId);
            const voice = this.client.channels.cache.get(player.voiceChannelId);
            const findMusicChannel = yield this.client.prisma.guildMusicChannel.findUnique({
                where: {
                    guild_id: player.guildId,
                    channel_id: player.textChannelId
                },
                select: {
                    content_banner_id: true,
                    content_queue_id: true,
                    content_playing_id: true,
                    webhook_id: true,
                    webhook_token: true,
                }
            });
            if (findMusicChannel) {
                const webhook = new MusicChannelWebhook_util_1.default(findMusicChannel.webhook_id, findMusicChannel.webhook_token);
                yield webhook.editQueueTrack(this.client, player, findMusicChannel.content_queue_id);
                yield webhook.editEmbedTrack(this.client, player, findMusicChannel.content_playing_id);
            }
            else {
                yield channel.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Random")
                            .setThumbnail((_a = track.artworkUrl) !== null && _a !== void 0 ? _a : null)
                            .addFields([
                            {
                                name: `🎵 | กำลังเล่นเพลง`,
                                value: `[${track.title}](${track.url})`,
                                inline: false,
                            },
                            {
                                name: `🏡 | ในห้อง`,
                                value: `<#${voice.id}>`,
                                inline: true,
                            },
                            {
                                name: `⏲️ | ความยาว`,
                                value: `\`${new convertTime_util_1.default().convertTime(track.duration)}\``,
                                inline: true,
                            },
                            {
                                name: `📥 | ขอเพลงโดย`,
                                value: `${(_b = track.requestedBy) === null || _b === void 0 ? void 0 : _b.toString}`,
                                inline: true,
                            },
                        ])
                            .setFooter({ text: (_d = (_c = this.client.user) === null || _c === void 0 ? void 0 : _c.username) !== null && _d !== void 0 ? _d : "" })
                            .setTimestamp()
                    ],
                });
            }
        });
    }
}
exports.default = TrackStart;
//# sourceMappingURL=trackStart.event.js.map