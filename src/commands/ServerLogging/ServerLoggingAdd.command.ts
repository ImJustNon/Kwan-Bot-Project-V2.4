import { ActionRowBuilder, AnyComponentBuilder, APIEmbedField, APIMessageComponentEmoji, APISelectMenuOption, ApplicationCommandOptionType, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, ChannelType, ChatInputCommandInteraction, Collection, CommandInteraction, ComponentType, EmbedBuilder, Guild, GuildMember, Interaction, InteractionCallbackResponse, InteractionResponse, MessageFlags, RestOrArray, SlashCommandBuilder, SlashCommandStringOption, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { config } from "../../config/config";
import axios from "axios";
import ReplyEmbed from "../../utils/ReplyEmbed.util";
import { GuildAutoVoiceChannel } from "../../models/GuildAutoVoiceChannel.model";
import { GuildCaptcha } from "../../models/GuildCaptcha.model";
import { LoggingEvent } from "../../utils/LoggingEvent.util";

export default class CaptchaSetup extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "serverlogging-add",
            description: {
                content: "Show very event that happen on your server",
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
                    name: "category",
                    description: `เลือกประเภทเหตุการณ์ที่อยากให้บันทึก`,
                    type: ApplicationCommandOptionType.String,
                    
                    choices: [
                        ...LoggingEvent.map(l => ({
                            name: l.description,
                            value: l.event
                        })),
                        {
                            name: "ทั้งหมด",
                            value: "all"
                        }
                    ],
                    required: true,
                }
            ],
        });
    }
    async callback(client: BotClient, interaction: ChatInputCommandInteraction): Promise<any>{

    }
};
