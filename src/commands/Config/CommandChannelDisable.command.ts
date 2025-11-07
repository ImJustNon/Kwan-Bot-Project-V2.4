import { ActionRowBuilder, AnyComponentBuilder, APIEmbedField, APIMessageComponentEmoji, APISelectMenuOption, ApplicationCommandOptionType, CacheType, ChannelType, ChatInputCommandInteraction, Collection, CommandInteraction, ComponentType, EmbedBuilder, Guild, GuildMember, Interaction, InteractionCallbackResponse, InteractionResponse, MessageFlags, RestOrArray, SlashCommandStringOption, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { config } from "../../config/config";
import axios from "axios";
import ReplyEmbed from "../../utils/ReplyEmbed.util";
import { GuildCommandChannel } from "../../models/GuildCommandChannel.model";

export default class CommandChannelDisable extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "command-channel-disable",
            description: {
                content: "Disable Command Channel",
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
            options: [],
        });
    }
    async callback(client: BotClient, interaction: ChatInputCommandInteraction): Promise<any>{
        const guild: Guild | undefined = client.guilds.cache.get(interaction.guildId || "");
 
        if(!guild) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล Guild ที่อยู่ตอนนี้"));


        try {
            const findCommandChannel = await GuildCommandChannel.findOne({
                guild_id: guild.id
            });

            if(!findCommandChannel){
                return await interaction.reply(new ReplyEmbed().warn(`Guild นี้ยังไม่ได้เปิดการตั้งค่า \`Command Channel\` ไว้นะคะ หากต้องการตั้งค่าช่องใหม่ใช้คำสั่ง \`/command-channel-enable\` ได้เลยนะคะ`)); 
            }

            // insert data
            await GuildCommandChannel.deleteOne({
                guild_id: guild.id
            });

            return await interaction.reply(new ReplyEmbed().success(`ทำยกเลิกการตั้งค่า ช่องคำสั่ง เรียบร้อยเเล้วค่ะ`))
        }
        catch(e){
            return interaction.reply(new ReplyEmbed().error("Internal Server Error"));
        }

    }
};
