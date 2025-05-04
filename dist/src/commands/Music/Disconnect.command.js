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
class Disconnect extends Command_class_1.Command {
    constructor(client) {
        super(client, {
            name: "disconnect",
            description: {
                content: "Disconnect bot from playing channel",
                examples: [""],
                usage: "",
            },
            category: "Music",
            cooldown: 3,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            options: [],
        });
    }
    callback(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const guild = client.guilds.cache.get((_a = interaction.guildId) !== null && _a !== void 0 ? _a : "");
            const member = guild === null || guild === void 0 ? void 0 : guild.members.cache.get((_c = (_b = interaction.member) === null || _b === void 0 ? void 0 : _b.user.id) !== null && _c !== void 0 ? _c : "");
            const channel = member === null || member === void 0 ? void 0 : member.voice.channel;
            const player = client.manager.players.get(guild.id);
            if (!player) {
                return yield interaction.reply({
                    content: `There is nothing playing in this server!`
                });
            }
            const voiceChannel = channel;
            if (!voiceChannel) {
                return yield interaction.reply({
                    content: `You need to be in a voice channel to use this command!`
                });
            }
            if (voiceChannel.id !== player.voiceChannelId) {
                return yield interaction.reply({
                    content: `You need to be in the same voice channel as the bot to use this command!`
                });
            }
            player.queue.clear();
            player.stop();
            const embed = new discord_js_1.EmbedBuilder()
                .setDescription(`Stopped the player and cleared the queue`)
                .setColor("Green");
            yield interaction.reply({
                embeds: [embed]
            });
        });
    }
}
exports.default = Disconnect;
;
//# sourceMappingURL=Disconnect.command.js.map