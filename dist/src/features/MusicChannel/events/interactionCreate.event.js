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
const discord_js_1 = require("discord.js");
const MusicChannelWebhook_util_1 = __importDefault(require("../../../utils/MusicChannelWebhook.util"));
class InteractionCreate {
    constructor(client) {
        client.on("interactionCreate", (interaction) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const commandInteraction = interaction;
            if (!interaction.isButton())
                return;
            if (!(interaction.channel instanceof discord_js_1.TextChannel))
                return;
            if (!interaction.channel.name.includes("music") && !interaction.channel.name.includes(`${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username}-music`) && !interaction.channel.name.includes(`${(_b = client.user) === null || _b === void 0 ? void 0 : _b.username}`))
                return;
            const findMusicChannel = yield client.prisma.guildMusicChannel.findUnique({
                where: {
                    guild_id: (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.id,
                    channel_id: (_d = interaction.channel) === null || _d === void 0 ? void 0 : _d.id
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
            const player = client.manager.players.get(interaction.guildId || "");
            if (!player || !player.queue) {
                return commandInteraction.reply({
                    content: '🟡 | ยังไม่มีการเล่นเพลง ณ ตอนนี้เลยน่ะ',
                    ephemeral: true,
                });
            }
            const member = interaction.member;
            const voiceChannel = member.voice.channel;
            if (!voiceChannel) {
                return commandInteraction.reply({
                    content: '🟡 | โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ',
                    ephemeral: true,
                });
            }
            const bot = (_e = interaction.guild) === null || _e === void 0 ? void 0 : _e.members.cache.get(client.user.id);
            if ((bot === null || bot === void 0 ? void 0 : bot.voice.channel) && !voiceChannel.equals(bot.voice.channel)) {
                return member.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setDescription('🔴 | ตอนนี้มีคนกำลังใช้งานอยู่น่ะ')
                            .setColor("Red")
                            .setFooter({
                            text: client.user.username
                        })
                            .setTimestamp(),
                    ],
                }).then((msg) => __awaiter(this, void 0, void 0, function* () {
                    yield msg.react('🚫').catch(err => console.log(err));
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        yield msg.delete();
                    }), 15000);
                }));
            }
            const buttonInteraction = interaction;
            const webhook = new MusicChannelWebhook_util_1.default(findMusicChannel.webhook_id, findMusicChannel.webhook_token);
            if (buttonInteraction.customId === 'music_pause') {
                if (!player.paused) {
                    player.pause();
                    yield commandInteraction.reply('🟢 | ทำการหยุดเพลงชั่วคราวเรียบร้อยเเล้วค่ะ').then(() => __awaiter(this, void 0, void 0, function* () {
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield commandInteraction.deleteReply();
                        }), 5000);
                    }));
                }
                else if (player.paused) {
                    player.resume();
                    yield commandInteraction.reply('🟢 | ทำการเล่นเพลงต่อเเล้วค่ะ').then(() => __awaiter(this, void 0, void 0, function* () {
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield commandInteraction.deleteReply();
                        }), 5000);
                    }));
                }
            }
            else if (buttonInteraction.customId === 'music_skip') {
                yield player.skip();
                yield commandInteraction.reply('🟢 | ทำการข้ามเพลงให้เรียบร้อยเเล้วค่ะ').then(() => __awaiter(this, void 0, void 0, function* () {
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        yield commandInteraction.deleteReply();
                    }), 5000);
                }));
            }
            else if (buttonInteraction.customId === 'music_stop') {
                if (player.playing) {
                    player.destroy();
                    yield commandInteraction.reply('🟢 | ทำการปิดเพลงเรียบร้อยเเล้วค่ะ').then(() => __awaiter(this, void 0, void 0, function* () {
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield commandInteraction.deleteReply();
                        }), 5000);
                    }));
                }
            }
            else if (buttonInteraction.customId === 'music_loop') {
                if (player.loop === "off") {
                    yield player.setLoop("queue");
                    yield commandInteraction.reply(`🟢 | ทำการเปิดการวนซ้ำเพลงเเบบ \`ทั้งหมด\` เรียบร้อยเเล้วค่ะ`).then(() => __awaiter(this, void 0, void 0, function* () {
                        yield webhook.editEmbedTrack(client, player, findMusicChannel.content_playing_id);
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield commandInteraction.deleteReply();
                        }), 5000);
                    }));
                }
                else if (player.loop === "queue") {
                    yield player.setLoop("track");
                    yield commandInteraction.reply(`🟢 | ทำการเปิดการวนซ้ำเพลงเเบบ \`เพลงเดียว\` เรียบร้อยเเล้วค่ะ`).then(() => __awaiter(this, void 0, void 0, function* () {
                        yield webhook.editEmbedTrack(client, player, findMusicChannel.content_playing_id);
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield commandInteraction.deleteReply();
                        }), 5000);
                    }));
                }
                else if (player.loop === "track") {
                    yield player.setLoop("off");
                    yield commandInteraction.reply(`🟢 | ทำการปิดวนซ้ำเพลงเรียบร้อยเเล้วค่ะ`).then(() => __awaiter(this, void 0, void 0, function* () {
                        yield webhook.editEmbedTrack(client, player, findMusicChannel.content_playing_id);
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield commandInteraction.deleteReply();
                        }), 5000);
                    }));
                }
            }
            else if (buttonInteraction.customId === 'music_shuffle') {
                if (!player.queue || !player.queue.size || player.queue.size == 0) {
                    yield commandInteraction.reply('🟡 | เอ๊ะ! ดูเหมือนว่าคิวของคุณจะไม่มีความยาวมากพอน่ะคะ').then(() => __awaiter(this, void 0, void 0, function* () {
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield commandInteraction.deleteReply();
                        }), 5000);
                    }));
                }
                else {
                    yield player.queue.shuffle();
                    yield commandInteraction.reply('🟢 | ทำการสุ่มเรียงรายการคิวใหม่เรียบร้อยเเล้วค่ะ').then(() => __awaiter(this, void 0, void 0, function* () {
                        yield webhook.editQueueTrack(client, player, findMusicChannel.content_queue_id);
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield commandInteraction.deleteReply();
                        }), 5000);
                    }));
                }
            }
            else if (buttonInteraction.customId === 'music_volup') {
                let newVol = player.volume + 10;
                if (newVol < 110) {
                    yield player.setVolume(newVol);
                    yield commandInteraction.reply(`🟢 | ทำการปรับความดังเสียงเป็น \`${newVol}\` เรียบร้อยเเล้วค่ะ`).then(() => __awaiter(this, void 0, void 0, function* () {
                        yield webhook.editEmbedTrack(client, player, findMusicChannel.content_playing_id);
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield commandInteraction.deleteReply();
                        }), 5000);
                    }));
                }
                else if (newVol >= 110) {
                    yield commandInteraction.reply(`🟡 | ไม่สามารถปรับความดังเสียงได้มากกว่านี้เเล้วค่ะ`).then(() => __awaiter(this, void 0, void 0, function* () {
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield commandInteraction.deleteReply();
                        }), 5000);
                    }));
                }
            }
            else if (buttonInteraction.customId === 'music_voldown') {
                let newVol = player.volume - 10;
                if (newVol > 0) {
                    yield player.setVolume(newVol);
                    yield commandInteraction.reply(`🟢 | ทำการปรับความดังเสียงเป็น \`${newVol}\` เรียบร้อยเเล้วค่ะ`).then(() => __awaiter(this, void 0, void 0, function* () {
                        yield webhook.editEmbedTrack(client, player, findMusicChannel.content_playing_id);
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield commandInteraction.deleteReply();
                        }), 5000);
                    }));
                }
                else if (newVol < 0) {
                    yield commandInteraction.reply(`🟡 | ไม่สามารถปรับความดังเสียงได้น้อยกว่านี้เเล้วค่ะ`).then(() => __awaiter(this, void 0, void 0, function* () {
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield commandInteraction.deleteReply();
                        }), 5000);
                    }));
                }
            }
            else if (buttonInteraction.customId === 'music_mute') {
                if (player.volume > 0) {
                    yield player.setVolume(0);
                    yield commandInteraction.reply(`🟢 | ทำการปิดเสียงเรียบร้อยเเล้วค่ะ`).then(() => __awaiter(this, void 0, void 0, function* () {
                        yield webhook.editEmbedTrack(client, player, findMusicChannel.content_playing_id);
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield commandInteraction.deleteReply();
                        }), 5000);
                    }));
                }
                else if (player.volume === 0) {
                    yield player.setVolume(80);
                    yield commandInteraction.reply(`🟢 | ทำการเปิดเสียงเรียบร้อยเเล้วค่ะ`).then(() => __awaiter(this, void 0, void 0, function* () {
                        yield webhook.editEmbedTrack(client, player, findMusicChannel.content_playing_id);
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            yield commandInteraction.deleteReply();
                        }), 5000);
                    }));
                }
            }
        }));
    }
}
exports.default = InteractionCreate;
//# sourceMappingURL=interactionCreate.event.js.map