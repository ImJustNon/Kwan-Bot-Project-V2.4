import { ActionRowBuilder, AnyComponentBuilder, APIEmbedField, APIMessageComponentEmoji, APISelectMenuOption, ApplicationCommandOptionType, CacheType, ChannelType, ChatInputCommandInteraction, Collection, CommandInteraction, ComponentType, EmbedBuilder, Guild, GuildMember, Interaction, InteractionCallbackResponse, InteractionResponse, MessageFlags, RestOrArray, SlashCommandStringOption, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { config } from "../../config/config";
import axios from "axios";
import ReplyEmbed from "../../utils/ReplyEmbed.util";
import { GuildAutoVoiceChannel } from "../../models/GuildAutoVoiceChannel.model";

export default class AutoVoiceChannelAdd extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "autovc-remove",
            description: {
                content: "Remove Auto VoiceChannel",
                examples: [""],
                usage: "",
            },
            category: "AutoVoiceChannel",
            cooldown: 3,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks", "ManageChannels", "MoveMembers"],
                user: ["Administrator"],
            },
            options: [
                {
                    name: "voice-channel",
                    description: `เลือกช่องเสียงที่ต้องการตั้งค่า`,
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                },
            ],
        });
    }
    async callback(client: BotClient, interaction: ChatInputCommandInteraction): Promise<any>{
        const voiceChannel = interaction.options.getChannel('voice-channel');
        const guild: Guild | undefined = client.guilds.cache.get(interaction.guildId || "");
        const member: GuildMember | undefined = guild?.members.cache.get(interaction.member?.user.id || "");
        

        if (!voiceChannel || voiceChannel.type !== ChannelType.GuildVoice) {
            return interaction.reply({
                ...new ReplyEmbed().warn("สามารถตั้งค่าได้เฉพาะ `ช่องเสียง` เท่านั้นน่ะ"),
                flags: MessageFlags.Ephemeral,
            });
        }
        if(!guild) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล Guild ที่อยู่ตอนนี้"));
        if(!member) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล User ที่ใช้อยู่ตอนนี้"));


        try {
            // const findVoiceChannel = await client.prisma.guildAutoVoiceChannel.findUnique({
            //     where: {
            //         guild_id: guild.id,
            //         channel_id: voiceChannel.id
            //     }
            // });
            const findVoiceChannel = await GuildAutoVoiceChannel.findOne({
                guild_id: guild.id,
                channel_id: voiceChannel.id
            });

            if(!findVoiceChannel){
                return await interaction.reply(new ReplyEmbed().warn(`ช่อง <#${voiceChannel.id}> ยังไม่ได้ถูกตั้งค่าน่ะ`)); 
            }

            // delete data
            // await client.prisma.guildAutoVoiceChannel.delete({
            //     where: {
            //         guild_id: guild.id,
            //         channel_id: voiceChannel.id,
            //     }
            // });
            await GuildAutoVoiceChannel.deleteOne({
                guild_id: guild.id,
                channel_id: voiceChannel.id
            });

            return await interaction.reply(new ReplyEmbed().success(`ลบช่อง <#${voiceChannel.id}> ออกจากการตั้งค่าเรียบร้อยเเล้ว`))
        }
        catch(e){
            return interaction.reply(new ReplyEmbed().error("Internal Server Error"));
        }

    }
};
