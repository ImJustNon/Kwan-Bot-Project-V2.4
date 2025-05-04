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
const MusicChannelWebhook_util_1 = __importDefault(require("../../../utils/MusicChannelWebhook.util"));
class MessageCreate {
    constructor(client) {
        client.on("messageCreate", (message) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            if (message.author.bot || message.author.username === ((_a = client.user) === null || _a === void 0 ? void 0 : _a.username))
                return;
            if (!message.guild)
                return;
            const textChannel = message.channel;
            if (!textChannel.name.includes("music") && !textChannel.name.includes(`${(_b = client.user) === null || _b === void 0 ? void 0 : _b.username}-music`) && !textChannel.name.includes(`${(_c = client.user) === null || _c === void 0 ? void 0 : _c.username}`))
                return;
            const findMusicChannel = yield client.prisma.guildMusicChannel.findUnique({
                where: {
                    guild_id: message.guild.id,
                    channel_id: message.channel.id
                },
                select: {
                    content_banner_id: true,
                    content_playing_id: true,
                    content_queue_id: true,
                    webhook_id: true,
                    webhook_token: true,
                }
            });
            if (!findMusicChannel)
                return;
            const messageContent = message.content;
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield message.delete();
            }), 1000);
            const bannerContent = yield textChannel.messages.fetch(findMusicChannel.content_banner_id);
            const queueContent = yield textChannel.messages.fetch(findMusicChannel.content_queue_id);
            const trackContent = yield textChannel.messages.fetch(findMusicChannel.content_playing_id);
            const memberVoiceChannel = (_d = message.member) === null || _d === void 0 ? void 0 : _d.voice.channel;
            if (!trackContent || !queueContent || !bannerContent) {
                return yield message.channel.send('🔴 | โครงสร้างข้อความในช่องนี้ เกิดข้อผิดพลาด').then((msg) => {
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        yield msg.delete();
                    }), 5000);
                });
            }
            if (!memberVoiceChannel) {
                return yield message.channel.send('🟡 | โปรดเข้าช่องเสียงก่อนเปิดเพลงน่ะ').then((msg) => {
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        yield msg.delete();
                    }), 5000);
                });
            }
            if (((_e = message.guild.members.me) === null || _e === void 0 ? void 0 : _e.voice.channel) && !memberVoiceChannel.equals(message.guild.members.me.voice.channel)) {
                return yield message.channel.send('🟡 | เอ๊ะ! ดูเหมือนว่าคุณจะไม่ได้อยู่ในช่องเสียงเดียวกันน่ะ').then((msg) => {
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        yield msg.delete();
                    }), 5000);
                });
            }
            let player = client.manager.players.get(message.guild.id);
            if (!player) {
                player = client.manager.createPlayer({
                    guildId: message.guildId,
                    voiceChannelId: memberVoiceChannel.id,
                    textChannelId: message.channelId,
                    autoPlay: false
                });
            }
            const result = yield client.manager.search({
                query: messageContent,
                source: "ytsearch",
                requester: (_f = message.member) === null || _f === void 0 ? void 0 : _f.user.id
            });
            if (result.loadType === "error") {
                return yield message.channel.send(`🔴 | ไม่สามารถค้นหาได้`).then((msg) => {
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        yield msg.delete();
                    }), 5000);
                });
            }
            else if (result.loadType === "empty") {
                return yield message.channel.send(`🟡 | ไม่พบผลการค้นหาสำหรับ ${messageContent}`).then((msg) => {
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        yield msg.delete();
                    }), 5000);
                });
            }
            if (result.loadType === "playlist") {
                for (let track of result.tracks) {
                    player.queue.add(track);
                }
                yield message.channel.send(`🟢 | เพิ่ม \`${result.tracks.length}\` รายการ จาก Playlist: \`${result.playlistInfo.name}\` เรียบร้อยเเล้ว`).then((msg) => {
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        yield msg.delete();
                    }), 5000);
                });
            }
            else {
                player.queue.add(result.tracks[0]);
                yield message.channel.send(`🟢 | เพิ่ม \`${result.tracks[0].title}\` เรียบร้อยเเล้ว`).then((msg) => {
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        yield msg.delete();
                    }), 5000);
                });
            }
            if (!player.playing && !player.paused) {
                yield player.play();
            }
            yield new MusicChannelWebhook_util_1.default(findMusicChannel.webhook_id, findMusicChannel.webhook_token).editQueueTrack(client, player, findMusicChannel.content_queue_id);
        }));
    }
}
exports.default = MessageCreate;
//# sourceMappingURL=messageCreate.event.js.map