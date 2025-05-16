import { ActionRowBuilder, AnyComponentBuilder, APIEmbedField, APIMessageComponentEmoji, APISelectMenuOption, ApplicationCommandOptionType, CacheType, CategoryChannel, ChannelType, ChatInputCommandInteraction, Collection, CommandInteraction, ComponentType, EmbedBuilder, Guild, GuildMember, Interaction, InteractionCallbackResponse, InteractionResponse, MessageFlags, RestOrArray, SlashCommandStringOption, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { config } from "../../config/config";
import axios from "axios";
import ReplyEmbed from "../../utils/ReplyEmbed.util";
import UpdateData from "../../utils/UpdateData.utils";
import { ServerStatsPrefix } from "../../enums/ServerStats.enum";

export default class ServerStatsCreate extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "serverstats-create",
            description: {
                content: "Setup Server State for your Guild",
                examples: [""],
                usage: "",
            },
            category: "ServerStats",
            cooldown: 3,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks", "ManageChannels", "Administrator"],
                user: ["Administrator"],
            },
            options: [
                {
                    name: "channel-type",
                    description: `เลือกประเภทช่องที่ต้องการจะตั้งค่า`,
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        {
                            name: "ช่องเสียง",
                            value: "voice",
                        },
                        {
                            name: "ช่องข้อความ",
                            value: "text"
                        }
                    ]
                },
                {
                    name: "text",
                    description: `ข้อความ สามารถใช้ %_% เพื่อเเทนค่าได้เช่น สามาชิก %_% คน`,
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: "data",
                    description: `เลือกข้อมูลที่จะให้เเสดง`,
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        {
                            name: "จำนวนสามาชิกทั้งหมด",
                            value: ServerStatsPrefix.CountMembersAll,
                        },
                        {
                            name: "จำนวนสามาชิกคน",
                            value: ServerStatsPrefix.CountMembersUsers
                        },
                        {
                            name: "จำนวนสามาชิกบอท",
                            value: ServerStatsPrefix.CountMembersBots
                        },
                        {
                            name: "จำนวนสามาชิกออนไลน์",
                            value: ServerStatsPrefix.CountMembersOnline
                        },
                        {
                            name: "จำนวนสามาชิกห้ามรบกวน",
                            value: ServerStatsPrefix.CountMembersDnd
                        },
                        {
                            name: "จำนวนสามาชิกไม่อยู่",
                            value: ServerStatsPrefix.CountMembersIdle
                        },
                        {
                            name: "จำนวนสามาชิกออฟไลน์",
                            value: ServerStatsPrefix.CountMembersOffline
                        },
                        {
                            name: "จำนวนช่องเสียงทั้งหมด",
                            value: ServerStatsPrefix.CountChannelsVoice
                        },
                        {
                            name: "จำนวนช่องข้อความทั้งหมด",
                            value: ServerStatsPrefix.CountChannelsText
                        }
                    ]
                },
            ],
        });
    }
    async callback(client: BotClient, interaction: ChatInputCommandInteraction): Promise<any>{
        const selectedChannelType = interaction.options.getString("channel-type");
        const selectedText = interaction.options.getString("text");
        const selectedData = interaction.options.getString("data");
        const guild: Guild | undefined = client.guilds.cache.get(interaction.guildId || "");
        const member: GuildMember | undefined = guild?.members.cache.get(interaction.member?.user.id || "");

        if(!selectedChannelType) return;
        if(!selectedText) return;
        if(!selectedData) return;
        if(!guild) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล Guild ที่อยู่ตอนนี้"));
        if(!member) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล User ที่ใช้อยู่ตอนนี้"));
        
        try {
            const findParent = await client.prisma.guildServerStats.findMany({
                where: {
                    guild_id: guild.id
                }
            });
            

            let parentId: string; 
            if(findParent.length === 0){
                parentId = (await this.createParent(guild)).id;
            }
            else if(findParent.length !== 0 && !guild.channels.cache.get(findParent[0].parent_id)){
                parentId = (await this.createParent(guild)).id;
            }
            else {
                parentId = findParent[0].parent_id;
            }

            const channelName = selectedText.replace("%_%", selectedData);
            const channelId = await this.createChannel(client, guild, parentId, selectedChannelType, channelName, selectedData);
        
            await client.prisma.guildServerStats.create({
                data: {
                    guild_id: guild.id,
                    channel_id: channelId,
                    channel_name: channelName,
                    parent_id: parentId,
                    prefix: selectedData
                }
            });

            await interaction.reply(new ReplyEmbed().success("ได้ทำการตั้งค่า สถานะเซิฟเวอร์ เรียบร้อยเเล้วนะคะ"));
        }
        catch(e){
            console.log(e);
            return await interaction.reply(new ReplyEmbed().error("Internal Server Error"));
        }
    }

    async createParent(guild: Guild): Promise<CategoryChannel>{
        const parent = await guild.channels.create({
            name: '📊 SERVER STATS 📊',
            type: ChannelType.GuildCategory
        });
        return parent;
    }

    async createChannel(client: BotClient, guild: Guild, parentId: string, type: string, text: string, data: string): Promise<string>{
        const channel = await guild.channels.create({
            name: new UpdateData(this.client, guild, text).getResult(),
            type: type === "voice" ? ChannelType.GuildVoice : ChannelType.GuildText,
            parent: parentId
        });

        const everyoneRole = guild.roles.everyone;
        channel.permissionOverwrites.edit(everyoneRole, {
            ViewChannel: true,
            Connect: false,
            SendMessages: false,
            ReadMessageHistory: false
        });
        
        return channel.id;
    }
};
