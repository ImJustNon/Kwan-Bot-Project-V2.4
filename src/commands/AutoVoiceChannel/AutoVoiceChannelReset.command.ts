import { ActionRowBuilder, AnyComponentBuilder, APIEmbedField, APIMessageComponentEmoji, APISelectMenuOption, ApplicationCommandOptionType, CacheType, ChannelType, ChatInputCommandInteraction, Collection, CommandInteraction, ComponentType, EmbedBuilder, Guild, GuildMember, Interaction, InteractionCallbackResponse, InteractionResponse, MessageFlags, RestOrArray, SlashCommandStringOption, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { config } from "../../config/config";
import axios from "axios";
import ReplyEmbed from "../../utils/ReplyEmbed.util";
import { GuildAutoVoiceChannel } from "../../models/GuildAutoVoiceChannel.model";

export default class AutoVoiceChannelReset extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "autovc-reset",
            description: {
                content: "Reset Auto VoiceChannel Config",
                examples: [""],
                usage: "",
            },
            category: "AutoVoiceChannel",
            cooldown: 3,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks", "ManageChannels"],
                user: ["Administrator"],
            },
            options: [],
        });
    }
    async callback(client: BotClient, interaction: ChatInputCommandInteraction): Promise<any>{
        const guild: Guild | undefined = client.guilds.cache.get(interaction.guildId || "");

        if(!guild) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล Guild ที่อยู่ตอนนี้"));

        try {
            // await client.prisma.guildAutoVoiceChannel.deleteMany({
            //     where: {
            //         guild_id: guild.id,
            //     }
            // });
            await GuildAutoVoiceChannel.deleteMany({
                guild_id: guild.id
            });

            return await interaction.reply(new ReplyEmbed().success(`รีเซ็ตการตั้งค่าเรียบร้อยเเล้ว`));
        }
        catch(e){
            return interaction.reply(new ReplyEmbed().error("Internal Server Error"));
        }

    }
};
