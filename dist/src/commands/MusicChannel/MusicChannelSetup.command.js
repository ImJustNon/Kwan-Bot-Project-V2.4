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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_class_1 = require("../../classes/Command.class");
const config_1 = require("../../config/config");
class MusicChannelSetup extends Command_class_1.Command {
    constructor(client) {
        super(client, {
            name: "music-channel-setup",
            description: {
                content: "Setup the channel for request and control player",
                examples: [""],
                usage: "",
            },
            category: "MusicChannel",
            cooldown: 3,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks", "ManageChannels", "ManageWebhooks"],
                user: ["Administrator"],
            },
            options: [],
        });
    }
    callback(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield interaction.reply({
                content: "⌛ | กำลังตั้งค่าห้องเล่นเพลง กรุณารอซักครู่น่ะ",
            });
            try {
                const guildId = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id;
                const findCurrentData = yield client.prisma.guildMusicChannel.findUnique({
                    where: {
                        guild_id: guildId
                    }
                });
                if (findCurrentData) {
                    return yield interaction.editReply({
                        content: "🟡 | เซิฟเวอร์นี้ได้่สร้างช่องไว้เเล้ว หากต้องการสร้างใหม่ให้ทำการลบด้วยคำสั่ง `/music-remove`",
                    });
                }
                yield this.setupChannel(client, interaction);
                yield interaction.editReply("🟢 | ทำการตั้งค่า เรียบร้อยเเล้ว");
            }
            catch (e) {
                console.log(e);
                return interaction.followUp({
                    content: "🔴 | ไม่สามารถใช้งานได่ในขณะนี้"
                });
            }
        });
    }
    setupChannel(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.create({
                name: `${(_b = client.user) === null || _b === void 0 ? void 0 : _b.username}-music`,
                type: discord_js_1.ChannelType.GuildText,
                parent: null,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [discord_js_1.PermissionsBitField.Flags.UseApplicationCommands]
                    }
                ]
            }).then((ch) => __awaiter(this, void 0, void 0, function* () {
                yield this.setupWebhook(client, interaction, ch);
            })));
        });
    }
    setupWebhook(client, interaction, ch) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const webhook = yield ch.createWebhook({
                    name: client.user.username,
                    avatar: (_a = client.user) === null || _a === void 0 ? void 0 : _a.displayAvatarURL(),
                });
                yield this.setupDefaultMessage(client, interaction, ch, webhook);
            }
            catch (e) {
                console.log(e);
                return interaction.followUp({
                    content: "🔴 | ไม่สามารถใช้งานได่ในขณะนี้"
                });
            }
        });
    }
    setupDefaultMessage(client, interaction, ch, webhook) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const channelId = ch.id;
            const authorId = (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.id;
            const guildId = (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id;
            yield ch.setTopic(`play_pause: | หยุดเพลง หรือ เล่นเพลงต่อ :track_next: | ข้ามเพลง :stop_button: | ปิดเพลง :repeat: | เปิด/ปิด การใช้งานวนซ้ำ :twisted_rightwards_arrows: | สลับคิวเพลง :sound: | ลดเสียง :loud_sound: | เพิ่มเสียง :speaker: | ปิด/เปิดเสียง`);
            let contentBannerId = "";
            let contentqueueId = "";
            let contentCurrentId = "";
            yield webhook.send({
                content: config_1.config.assets.musicChannel.bannerUrl,
            }).then((msg) => contentBannerId = msg.id);
            yield webhook.send({
                content: "**คิวเพลง:** \nเข้าช่องเสียง และพิมพ์ชื่อเพลงหรือลิงก์ของเพลง เพื่อเปิดเพลงน่ะ "
            }).then((msg) => contentqueueId = msg.id);
            yield webhook.send({
                embeds: [
                    new discord_js_1.EmbedBuilder().setColor(config_1.config.assets.musicChannel.defaultColor).setTitle("ยังไม่มีเพลงเล่นอยู่ ณ ตอนนี้").setImage(config_1.config.assets.musicChannel.defaultUrl).setFooter({ text: "ใช้ /help สำหรับคำสั่งเพิ่มเติม" }).setTimestamp(),
                ],
                components: [
                    new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId(`music_pause`).setStyle(discord_js_1.ButtonStyle.Success).setEmoji(`⏯`), new discord_js_1.ButtonBuilder().setCustomId(`music_skip`).setStyle(discord_js_1.ButtonStyle.Secondary).setEmoji(`⏭`), new discord_js_1.ButtonBuilder().setCustomId(`music_stop`).setStyle(discord_js_1.ButtonStyle.Danger).setEmoji(`⏹`), new discord_js_1.ButtonBuilder().setCustomId(`music_loop`).setStyle(discord_js_1.ButtonStyle.Secondary).setEmoji(`🔁`), new discord_js_1.ButtonBuilder().setCustomId(`music_shuffle`).setStyle(discord_js_1.ButtonStyle.Success).setEmoji(`🔀`)),
                    new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId(`music_volup`).setLabel(`เพิ่มเสียง`).setStyle(discord_js_1.ButtonStyle.Primary).setEmoji(`🔊`), new discord_js_1.ButtonBuilder().setCustomId(`music_voldown`).setLabel(`ลดเสียง`).setStyle(discord_js_1.ButtonStyle.Primary).setEmoji(`🔉`), new discord_js_1.ButtonBuilder().setCustomId(`music_mute`).setLabel(`ปิด/เปิดเสียง`).setStyle(discord_js_1.ButtonStyle.Primary).setEmoji(`🔈`)),
                ],
            }).then((msg) => contentCurrentId = msg.id);
            yield client.prisma.guildMusicChannel.create({
                data: {
                    guild_id: guildId,
                    channel_id: channelId,
                    webhook_id: webhook.id,
                    webhook_token: webhook.token,
                    creator_user_id: interaction.user.id,
                    content_banner_id: contentBannerId,
                    content_queue_id: contentqueueId,
                    content_playing_id: contentCurrentId
                }
            }).catch(e => {
                return interaction.followUp({
                    content: "🔴 | ไม่สามารถใช้งานได่ในขณะนี้",
                });
            });
        });
    }
}
exports.default = MusicChannelSetup;
;
//# sourceMappingURL=MusicChannelSetup.command.js.map