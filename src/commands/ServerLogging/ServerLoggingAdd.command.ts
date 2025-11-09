import { ActionRowBuilder, AnyComponentBuilder, APIEmbedField, APIMessageComponentEmoji, APISelectMenuOption, ApplicationCommandOptionType, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, ChannelType, ChatInputCommandInteraction, Collection, CommandInteraction, ComponentType, EmbedBuilder, Guild, GuildMember, Interaction, InteractionCallbackResponse, InteractionResponse, MessageFlags, RestOrArray, SlashCommandBuilder, SlashCommandStringOption, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { config } from "../../config/config";
import axios from "axios";
import ReplyEmbed from "../../utils/ReplyEmbed.util";
import { GuildAutoVoiceChannel } from "../../models/GuildAutoVoiceChannel.model";
import { GuildCaptcha } from "../../models/GuildCaptcha.model";
import { LoggingCategory, LoggingEvent } from "../../utils/LoggingEvent.util";
import { GuildLoggingChannel } from "../../models/GuildLoggingChannel.model";

export default class ServerLoggingAdd extends Command {
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
                    description: `ประเภทเหตุการณ์`,
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "select-category",
                            description: "เลือกประเภทเหตุการณ์ที่อยากให้บันทึก",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                            choices: [
                                {
                                    name: "ทั้งหมด",
                                    value: "category_all",
                                },
                                ...LoggingCategory.map(lc => ({
                                    name: `ประเภท-${lc.description}`,
                                    value: `category_${lc.name}`
                                }))
                            ]
                        }
                    ]
                },
                {
                    name: "event",
                    description: `เหตุการณ์`,
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "select-event",
                            description: "เลือกเหตุการณ์ที่อยากให้บันทึก",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                            choices: [
                                {
                                    name: "ทั้งหมด",
                                    value: "event_all",
                                },
                                ...LoggingEvent.map(lm => ({
                                    name: `เหตุการณ์-${lm.description}`,
                                    value: `event_${lm.event}`
                                }))
                            ]
                        }
                    ]
                },
            ],
        });
    }
    async callback(client: BotClient, interaction: ChatInputCommandInteraction): Promise<any>{
        const sub = interaction.options.getSubcommand(true);

        if(sub === "category") return await this.addByCategory(interaction); 
        if(sub === "event") return await this.addByEvent(interaction);
        
        return await interaction.reply(new ReplyEmbed().error("ไม่พบตัวเลือก"));
    }

    async addByCategory(interaction: ChatInputCommandInteraction){
        const selectedCategory = interaction.options.getString("select-category", true);


        const findLoggingChannelSetup = await GuildLoggingChannel.findOne({
            guild_id: interaction.guildId
        });

        if(!findLoggingChannelSetup) return await interaction.reply(new ReplyEmbed().warn("เซิฟเวอร์นี้ยังไม่ได้ตั้งค่าช่องบันทึกเลยนะคะ สามารถใช้คำสั่ง `/serverlogging-setup` เพื่อตั้งค่าช่องได้เลยค่ะ"));


        const events = selectedCategory !== "category_all" ? LoggingEvent.filter(event => event.category === selectedCategory.replace("category_", "")).map(event => event.event) : LoggingEvent.map(event => event.event);

        await GuildLoggingChannel.findOneAndUpdate({
            guild_id: interaction.guildId
        },{
            $set: {
                events: [...new Set([
                    ...findLoggingChannelSetup.events,
                    ...events
                ])],
            }
        },{
            new: true
        });

        return await interaction.reply(new ReplyEmbed().success(`ได้ตั้งค่าเพิ่ม \`${LoggingCategory.find(c => c.name === selectedCategory.replace("category_", ""))?.description || selectedCategory}\` เรียบร้อยค่ะ`));
    }

    async addByEvent(interaction: ChatInputCommandInteraction){
        const selectedEvent = interaction.options.getString("select-event", true);

        const findLoggingChannelSetup = await GuildLoggingChannel.findOne({
            guild_id: interaction.guildId
        });

        if(!findLoggingChannelSetup) return await interaction.reply(new ReplyEmbed().warn("เซิฟเวอร์นี้ยังไม่ได้ตั้งค่าช่องบันทึกเลยนะคะ สามารถใช้คำสั่ง `/serverlogging-setup` เพื่อตั้งค่าช่องได้เลยค่ะ"));

        
        await GuildLoggingChannel.findOneAndUpdate({
            guild_id: interaction.guildId
        },{
            $set: {
                events: [...new Set([
                    ...findLoggingChannelSetup.events,
                    ...selectedEvent !== "event_all" ? [selectedEvent.replace("event_", "")] : LoggingEvent.map(event => event.event)
                ])],
            }
        },{
            new: true
        });

        return await interaction.reply(new ReplyEmbed().success(`ได้ตั้งค่าเพิ่ม \`${LoggingEvent.find((e) => e.event === selectedEvent.replace("event_", ""))?.description || selectedEvent}\` เรียบร้อยค่ะ`));
    }
};
