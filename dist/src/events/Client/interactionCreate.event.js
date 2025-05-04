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
const Event_class_1 = require("../../classes/Event.class");
class InteractionCreate extends Event_class_1.Event {
    constructor(client, file) {
        super(client, file, {
            name: "interactionCreate",
            type: "client"
        });
    }
    callback(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (interaction instanceof discord_js_1.CommandInteraction && interaction.type === discord_js_1.InteractionType.ApplicationCommand) {
                const commandName = interaction.commandName;
                const command = this.client.commands.get(interaction.commandName);
                if (!command)
                    return;
                if (!interaction.inGuild())
                    return;
                const me = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.me;
                if (!me)
                    return;
                const channel = interaction.channel;
                if (!((_b = channel === null || channel === void 0 ? void 0 : channel.permissionsFor(me)) === null || _b === void 0 ? void 0 : _b.has(discord_js_1.PermissionFlagsBits.SendMessages)))
                    return;
                if (!((_c = interaction.guild.members.me) === null || _c === void 0 ? void 0 : _c.permissions.has(discord_js_1.PermissionFlagsBits.SendMessages))) {
                    return yield interaction.reply({
                        content: `I don't have **\`SendMessage\`** permission in \`${interaction.guild.name}\`\nchannel: <#${interaction.channelId}>`,
                    }).catch(() => { });
                }
                if (!interaction.guild.members.me.permissions.has(discord_js_1.PermissionFlagsBits.EmbedLinks)) {
                    return yield interaction.reply({
                        content: "I don't have **`EmbedLinks`** permission."
                    }).catch(() => { });
                }
                if (command.permissions) {
                    if (command.permissions.client) {
                        if (!interaction.guild.members.me.permissions.has(command.permissions.client)) {
                            return yield interaction.reply({
                                content: "I don't have enough permissions to execute this command."
                            }).catch(() => { });
                        }
                    }
                    if (command.permissions.user) {
                        const member = interaction.member;
                        if (!member.permissions.has(command.permissions.user)) {
                            return yield interaction.reply({
                                content: "You don't have enough permissions to use this command.",
                                ephemeral: true
                            }).catch(() => { });
                        }
                    }
                    if (command.permissions.dev) {
                        if (this.client.config.owners) {
                            const findDev = this.client.config.owners.find((x) => x === interaction.user.id);
                            if (!findDev)
                                return;
                        }
                    }
                }
                if (!this.client.cooldown.has(commandName)) {
                    this.client.cooldown.set(commandName, new discord_js_1.Collection());
                }
                const now = Date.now();
                const timestamps = this.client.cooldown.get(commandName);
                const cooldownAmount = Math.floor(command.cooldown || 5) * 1000;
                if (!timestamps.has(interaction.user.id)) {
                    timestamps.set(interaction.user.id, now);
                    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
                }
                else {
                    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                    const timeLeft = (expirationTime - now) / 1000;
                    if (now < expirationTime && timeLeft > 0.9) {
                        return yield interaction.reply({
                            content: `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandName}\` command.`,
                        });
                    }
                    timestamps.set(interaction.user.id, now);
                    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
                }
                try {
                    yield command.callback(this.client, interaction);
                }
                catch (error) {
                    this.client.logger.error(error);
                    yield interaction.reply({ content: `An error occurred: \`${error}\`` });
                }
            }
        });
    }
}
exports.default = InteractionCreate;
//# sourceMappingURL=interactionCreate.event.js.map