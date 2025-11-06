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
            name: "autovc-list",
            description: {
                content: "List all setup voicchannel",
                examples: ["help"],
                usage: "help",
            },
            category: "AutoVoiceChannel",
            cooldown: 3,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks", "ManageChannels", "MoveMembers"],
                user: ["Administrator"],
            },
            options: [],
        });
    }
    async callback(client: BotClient, interaction: ChatInputCommandInteraction): Promise<any>{
        const guild: Guild | undefined = client.guilds.cache.get(interaction.guildId || "");

        if(!guild) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล Guild ที่อยู่ตอนนี้"));

        try {
            // const findVoiceChannel = await client.prisma.guildAutoVoiceChannel.findMany({
            //     where: {
            //         guild_id: guild.id
            //     }
            // });
            const findVoiceChannel = await GuildAutoVoiceChannel.find({
                guild_id: guild.id
            });

            if(findVoiceChannel.length === 0) return await interaction.reply(new ReplyEmbed().warn("ไม่พบข้อมูลการตั้งค่า ช่องเสียงอัตโนมัติ ในเซืฟเวอร์นี้"));


            let embed = new EmbedBuilder().setColor(config.assets.embed.default.color).setTitle("⚙ | รายการช่องที่ตั้งค่าทั้งหมด").setFooter({text: client.user?.username ?? ""}).setTimestamp();
            findVoiceChannel.forEach(async vc =>{
                const date = new Date(vc.created_at);
                const dateFormat = date.getHours() + ":" + date.getMinutes() + ", "+ date.toDateString();
                embed.addFields({
                    name: `🔊 | <#${vc.channel_id}> `,
                    value: `🔧 | <@${vc.author_id}> \n ⌛ | \`${dateFormat}\``,
                    inline: true,
                });
            });

            return interaction.reply({
                embeds: [embed],
            });
        }
        catch(e){
            return interaction.reply(new ReplyEmbed().error(`Internal Server Error`));
        }
    }
};
