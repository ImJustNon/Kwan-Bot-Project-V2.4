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

export default class ServerLoggingSetup extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "serverlogging-setup",
            description: {
                content: "setup channel for show every event that happen on your server",
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
                    name: "channel",
                    description: `ประเภทเหตุการณ์`,
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText],
                    required: true,
                },
                
            ],
        });
    }
    async callback(client: BotClient, interaction: ChatInputCommandInteraction): Promise<any>{
        const loggingChannel = interaction.options.getChannel("channel", true);

        const findLoggingChannelSetup = await GuildLoggingChannel.findOne({
            guild_id: interaction.guildId,
        });

        if(findLoggingChannelSetup) return await interaction.reply(new ReplyEmbed().warn("เซิฟเวอร์นี้ได้่ตั้งค่าเปิดใช้งานไปเเล้วนะคะ"));

        const webhook = await this.setupWebhook(client, interaction, loggingChannel as TextChannel);

        if(!webhook) return;

        await GuildLoggingChannel.create({
            guild_id: interaction.guildId,
            channel_id: loggingChannel.id,
            webhook_id: webhook.id,
            webhook_token: webhook.token,
            author_id: interaction.user.id,
            events: []
        });

        await interaction.reply(new ReplyEmbed().success("ได้ตั้งค่าช่องบันทึกเหตุการณ์สำเร็จ"));
    }


    async setupWebhook(client: BotClient, interaction: CommandInteraction, ch: TextChannel){
        try {
            const webhook: Webhook<WebhookType.Incoming> = await ch.createWebhook({
                name: client.user!.username,
                avatar: client.user?.displayAvatarURL(),  
            });

            return webhook;
        }
        catch(e){
            await interaction.followUp({
                content: "🔴 | ไม่สามารถใช้งานได่ในขณะนี้"
            });

            return null;
        }
    }
};
