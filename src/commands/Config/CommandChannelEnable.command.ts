import { ActionRowBuilder, AnyComponentBuilder, APIEmbedField, APIMessageComponentEmoji, APISelectMenuOption, ApplicationCommandOptionType, CacheType, ChannelType, ChatInputCommandInteraction, Collection, CommandInteraction, ComponentType, EmbedBuilder, Guild, GuildMember, Interaction, InteractionCallbackResponse, InteractionResponse, MessageFlags, RestOrArray, SlashCommandStringOption, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { config } from "../../config/config";
import axios from "axios";
import ReplyEmbed from "../../utils/ReplyEmbed.util";
import { GuildCommandChannel } from "../../models/GuildCommandChannel.model";

export default class CommandChannelEnable extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "command-channel-enable",
            description: {
                content: "Enable Command Channel",
                examples: [""],
                usage: "",
            },
            category: "Config",
            cooldown: 3,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks", "ManageChannels"],
                user: ["Administrator"],
            },
            options: [
                {
                    name: "text-channel",
                    description: `เลือกช่องข้อความที่ต้องการตั้งค่า`,
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                },
            ],
        });
    }
    async callback(client: BotClient, interaction: ChatInputCommandInteraction): Promise<any>{
        const textChannel = interaction.options.getChannel('text-channel');
        const guild: Guild | undefined = client.guilds.cache.get(interaction.guildId || "");
        const member: GuildMember | undefined = guild?.members.cache.get(interaction.member?.user.id || "");


        if (!textChannel || textChannel.type !== ChannelType.GuildText) {
            return interaction.reply({
                ...new ReplyEmbed().warn("สามารถตั้งค่าได้เฉพาะ `ช่องข้อความ` เท่านั้นน่ะ"),
                flags: MessageFlags.Ephemeral,
            });
        }
        if(!guild) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล Guild ที่อยู่ตอนนี้"));
        if(!member) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล User ที่ใช้อยู่ตอนนี้"));


        try {
            // const findCommandChannel = await client.prisma.guildCommandChannel.findUnique({
            //     where: {
            //         guild_id: guild.id
            //     }
            // });
            const findCommandChannel = await GuildCommandChannel.findOne({
                guild_id: guild.id
            });

            if(findCommandChannel){
                return await interaction.reply(new ReplyEmbed().warn(`Guild นี้ได้เปิดการตั้งค่า \`Command Channel\` ไว้เเล้วนะคะ หากต้องการตั้งค่าช่องใหม่ให้ปิดการใช้งาน \`/command-channel-disable\` ก่อนเเล้วตั้งค่าใหม่นะคะ`)); 
            }

            // insert data
            // await client.prisma.guildCommandChannel.create({
            //     data: {
            //         guild_id: guild.id,
            //         channel_id: textChannel.id,
            //         creator_user_id: member.id
            //     }
            // });
            await GuildCommandChannel.create({
                guild_id: guild.id,
                channel_id: textChannel.id,
                author_id: member.id
            });
            return await interaction.reply(new ReplyEmbed().success(`ทำการตั้งค่าช่อง <#${textChannel.id}> เป็นช่องใช้คำสั่งเรียบร้อยเเล้วค่ะ`));
        }
        catch(e){
            console.log(e);
            return interaction.reply(new ReplyEmbed().error("Internal Server Error"));
        }

    }
};
