import { ActionRowBuilder, AnyComponentBuilder, APIEmbedField, APIMessageComponentEmoji, APISelectMenuOption, ApplicationCommandOptionType, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, ChannelType, ChatInputCommandInteraction, Collection, CommandInteraction, ComponentType, EmbedBuilder, Guild, GuildMember, Interaction, InteractionCallbackResponse, InteractionResponse, MessageFlags, PermissionsBitField, RestOrArray, SlashCommandBuilder, SlashCommandStringOption, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextChannel, Webhook, WebhookType } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { config } from "../../config/config";
import axios from "axios";
import ReplyEmbed from "../../utils/ReplyEmbed.util";
import { GuildAutoVoiceChannel } from "../../models/GuildAutoVoiceChannel.model";
import { GuildCaptcha } from "../../models/GuildCaptcha.model";
import { LoggingCategory, LoggingEvent } from "../../utils/LoggingEvent.util";
import { GuildLoggingChannel } from "../../models/GuildLoggingChannel.model";

export default class ServerLoggingDisable extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "serverlogging-disable",
            description: {
                content: "disable logging channel",
                examples: [""],
                usage: "",
            },
            category: "ServerLogging",
            cooldown: 3,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks", "ManageChannels", "ManageWebhooks"],
                user: ["Administrator"],
            },
            options: [
                {
                    name: "confirm",
                    description: `ยืนยัน`,
                    type: ApplicationCommandOptionType.Boolean,
                    required: true,
                },
            ],
        });
    }
    async callback(client: BotClient, interaction: ChatInputCommandInteraction): Promise<any>{

        const isConfirm = interaction.options.getBoolean('confirm')!;
        if(!isConfirm){
            return await interaction.reply(new ReplyEmbed().success("หากต้องการปิดการใช้งานให้เลือก `true` นะคะ"));
        }

        const findLoggingChannelSetup = await GuildLoggingChannel.findOne({
            guild_id: interaction.guildId,
        });

        if(!findLoggingChannelSetup) return await interaction.reply(new ReplyEmbed().warn("เซิฟเวอร์ยังไม่ได้่ตั้งค่านะคะ"));


        await GuildLoggingChannel.deleteMany({
            guild_id: interaction.guildId,
        });

        await interaction.reply(new ReplyEmbed().success("ได้ยกเลิกตั้งค่าช่องบันทึกเหตุการณ์สำเร็จ"));
    }
};
