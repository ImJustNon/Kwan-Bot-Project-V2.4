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
            name: "music-channel-remove",
            description: {
                content: "Remove the channel for request and control player",
                examples: [""],
                usage: "",
            },
            category: "MusicChannel",
            cooldown: 3,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks", "ManageChannels"],
                user: ["Administrator"],
            },
            options: [],
        });
    }
    callback(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const findMusicChannel = yield client.prisma.guildMusicChannel.findUnique({
                    where: {
                        guild_id: (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id,
                    },
                    select: {
                        channel_id: true,
                        webhook_id: true
                    }
                });
                if (!findMusicChannel) {
                    return yield interaction.reply({
                        content: `🟡 | เอ๊ะ! ไม่พบข้อมูลการตั้งค่าช่องเล่นเพลงเลยนะ`
                    });
                }
                const embed = new discord_js_1.EmbedBuilder()
                    .setColor(config_1.config.assets.musicChannel.defaultColor)
                    .setTitle(`หากต้องการจะลบระบบห้องเพลงให้กด \`ยืนยัน\` \nหากต้องการยกเลิกให้กด \`ยกเลิก\``)
                    .setFooter({
                    text: client.user.username
                })
                    .setTimestamp();
                const yesBtn = new discord_js_1.ButtonBuilder()
                    .setLabel(`ยืนยัน [Accept]`)
                    .setCustomId(`yes`)
                    .setStyle(discord_js_1.ButtonStyle.Success)
                    .setEmoji(`✅`);
                const noBtn = new discord_js_1.ButtonBuilder()
                    .setLabel(`ยกเลิก [Cancel]`)
                    .setCustomId(`no`)
                    .setStyle(discord_js_1.ButtonStyle.Danger)
                    .setEmoji(`❌`);
                const btnRow = new discord_js_1.ActionRowBuilder()
                    .addComponents(yesBtn, noBtn);
                yield interaction.reply({
                    embeds: [embed],
                    components: [btnRow],
                    ephemeral: true
                });
                const filter = (i) => { var _a; return i.user.id === ((_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.id); };
                const collector = (_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.createMessageComponentCollector({ filter, time: 30000 });
                if (!collector)
                    return yield interaction.deleteReply();
                collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    if (i.customId === 'yes') {
                        const webhook = yield client.fetchWebhook(findMusicChannel.webhook_id);
                        yield webhook.delete();
                        const musicChannel = client.channels.cache.get(findMusicChannel.channel_id);
                        if (musicChannel) {
                            yield musicChannel.delete().catch(() => { });
                        }
                        yield client.prisma.guildMusicChannel.delete({
                            where: {
                                guild_id: (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id
                            }
                        });
                        return yield i.update({
                            content: '🟢 | ทำการลบการตั้งค่าห้องระบบเพลงเรียบร้อยเเล้วค่ะ',
                            embeds: [],
                            components: [],
                        });
                    }
                    else if (i.customId === 'no') {
                        return yield i.update({
                            content: '🟢 | ทำการยกเลิกรายการเรียบร้อยค่ะ',
                            embeds: [],
                            components: []
                        });
                    }
                }));
            }
            catch (e) {
                return interaction.followUp({
                    content: "🔴 | ไม่สามารถใช้งานได่ในขณะนี้",
                });
            }
        });
    }
}
exports.default = MusicChannelSetup;
;
//# sourceMappingURL=MusicChannelRemove.command.js.map