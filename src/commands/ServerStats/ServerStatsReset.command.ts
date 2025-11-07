import { ActionRowBuilder, AnyComponentBuilder, APIEmbedField, APIMessageComponentEmoji, APISelectMenuOption, ApplicationCommandOptionType, CacheType, CategoryChannel, ChannelType, ChatInputCommandInteraction, Collection, CommandInteraction, ComponentType, EmbedBuilder, Guild, GuildMember, Interaction, InteractionCallbackResponse, InteractionResponse, MessageFlags, RestOrArray, SlashCommandStringOption, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { config } from "../../config/config";
import axios from "axios";
import ReplyEmbed from "../../utils/ReplyEmbed.util";
import UpdateData from "../../utils/UpdateData.utils";
import { GuildServerStats } from "../../models/GuildServerStats.model";

export default class ServerStatsReset extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "serverstats-reset",
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
                    name: "confirm",
                    description: `พิมพ์ confirm เพื่อยืนยันการรีเซ็ต`,
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }
            ],
        });
    }
    async callback(client: BotClient, interaction: ChatInputCommandInteraction): Promise<any>{
        const confirm = interaction.options.getString("confirm");
        const guild: Guild | undefined = client.guilds.cache.get(interaction.guildId || "");
        const member: GuildMember | undefined = guild?.members.cache.get(interaction.member?.user.id || "");

        if(!confirm) return;
        if(!guild) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล Guild ที่อยู่ตอนนี้"));
        if(!member) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล User ที่ใช้อยู่ตอนนี้"));
        
        try {
            if(confirm !== "confirm") return await interaction.reply(new ReplyEmbed().warn("หากต้องการรีเซ็ตการตั้งค่าให้พิมพ์ \`confirm\` เท่านั้นนะคะ"));


            await GuildServerStats.deleteMany({
                guild_id: guild.id
            });

            await interaction.reply(new ReplyEmbed().success("ได้ทำลบการตั้งค่า สถานะเซิฟเวอร์ เรียบร้อยเเล้วนะคะ"));
        }
        catch(e){
            console.log(e);
            return await interaction.reply(new ReplyEmbed().error("Internal Server Error"));
        }
    }

};
