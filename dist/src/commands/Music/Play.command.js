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
const Command_class_1 = require("../../classes/Command.class");
class Play extends Command_class_1.Command {
    constructor(client) {
        super(client, {
            name: "play",
            description: {
                content: "Play music as you want",
                examples: ["/play <keywords or URL>"],
                usage: "/play <keywords or URL>",
            },
            category: "Music",
            cooldown: 3,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            options: [
                {
                    name: 'search',
                    description: 'พิมพ์สิ้งที่ต้องการค้นหา หรือ ลิ้งค์',
                    type: 3,
                    required: true,
                },
                {
                    name: 'platform',
                    description: 'เเหล่งที่มา เช่น Youtube',
                    type: 3,
                    choices: [
                        {
                            name: "Youtube",
                            value: 'ytsearch',
                        },
                        {
                            name: "Spotify",
                            value: 'spsearch',
                        }
                    ],
                    required: false,
                },
            ],
        });
    }
    callback(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            const query = (_a = interaction.options.get('search')) === null || _a === void 0 ? void 0 : _a.value;
            const source = (_b = interaction.options.get('platform')) === null || _b === void 0 ? void 0 : _b.value;
            const guild = client.guilds.cache.get((_c = interaction.guildId) !== null && _c !== void 0 ? _c : "");
            const member = guild === null || guild === void 0 ? void 0 : guild.members.cache.get((_e = (_d = interaction.member) === null || _d === void 0 ? void 0 : _d.user.id) !== null && _e !== void 0 ? _e : "");
            const channel = member === null || member === void 0 ? void 0 : member.voice.channel;
            const me = guild.members.cache.get((_g = (_f = client.user) === null || _f === void 0 ? void 0 : _f.id) !== null && _g !== void 0 ? _g : "");
            if (!channel) {
                return interaction.reply('⚠ | โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
            }
            if (me.voice.channel && !channel.equals(me.voice.channel)) {
                return interaction.reply('⚠ | ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
            }
            if (!query) {
                return interaction.reply('⚠ | โปรดระบุเพลงที่ต้องการด้วยน่ะ');
            }
            let player = client.manager.players.get(guild.id) || client.manager.createPlayer({
                guildId: interaction.guildId,
                voiceChannelId: channel.id,
                textChannelId: interaction.channelId,
                autoPlay: false
            });
            if (!player.connected)
                player.connect({ setDeaf: true });
            const searchResult = yield client.manager.search({
                query: query,
                requester: interaction.user.id
            });
            if (!searchResult.tracks.length) {
                return yield interaction.reply({
                    content: "Not Found"
                });
            }
            if (searchResult.loadType == "playlist") {
                for (const track of searchResult.tracks) {
                    player.queue.add(track);
                }
                yield interaction.reply(`${searchResult.playlistInfo.name} has been loaded with ${searchResult.tracks.length}`);
            }
            else {
                const track = searchResult.tracks[0];
                track.requestedBy = interaction.user;
                player.queue.add(track);
                yield interaction.reply(`Queued Track \n \`${track.title}\``);
            }
            if (!player.playing) {
                player.play();
            }
        });
    }
}
exports.default = Play;
;
//# sourceMappingURL=Play.command.js.map