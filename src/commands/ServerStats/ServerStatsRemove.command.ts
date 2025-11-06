import { ActionRowBuilder, AnyComponentBuilder, APIEmbedField, APIMessageComponentEmoji, APISelectMenuOption, ApplicationCommandOptionType, CacheType, CategoryChannel, ChannelType, ChatInputCommandInteraction, Collection, CommandInteraction, ComponentType, EmbedBuilder, Guild, GuildChannel, GuildMember, Interaction, InteractionCallbackResponse, InteractionResponse, MessageFlags, RestOrArray, SlashCommandStringOption, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { config } from "../../config/config";
import axios from "axios";
import ReplyEmbed from "../../utils/ReplyEmbed.util";
import UpdateData from "../../utils/UpdateData.utils";
import { GuildServerStats } from "../../models/GuildServerStats.model";

export default class ServerStatsRemove extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "serverstats-remove",
            description: {
                content: "Remove Server State",
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
                    name: "channel",
                    description: `เลือกช่องที่ต้องการลบ`,
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                },
                {
                    name: "confirm",
                    description: `พิมพ์ confirm เพื่อยืนยันการลบ`,
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }
            ],
        });
    }
    async callback(client: BotClient, interaction: ChatInputCommandInteraction): Promise<any>{
        const selectedChannel = interaction.options.getChannel("channel");
        const confirm = interaction.options.getString("confirm");
        const guild: Guild | undefined = client.guilds.cache.get(interaction.guildId || "");
        const member: GuildMember | undefined = guild?.members.cache.get(interaction.member?.user.id || "");

        if(!selectedChannel) return;
        if(!confirm) return;
        if(!guild) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล Guild ที่อยู่ตอนนี้"));
        if(!member) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล User ที่ใช้อยู่ตอนนี้"));
        
        try {
            if(confirm !== "confirm") return await interaction.reply(new ReplyEmbed().warn("หากต้องการลบการตั้งค่าให้พิมพ์ \`confirm\` เท่านั้นนะคะ"));

            // const findChannel = await client.prisma.guildServerStats.findUnique({
            //     where: {
            //         guild_id: guild.id,
            //         channel_id: selectedChannel.id
            //     }
            // });
            const findChannel = await GuildServerStats.findOne({
                guild_id: guild.id,
                channel_id: selectedChannel.id
            });

            if(!findChannel) return await interaction.reply(new ReplyEmbed().warn("ไม่พบข้อมูลการตั้งค่าของช่องนี้นะคะ"));

            const ch = guild.channels.cache.get(selectedChannel.id);
            if(ch) ch.delete().catch((e) => {});

            // await client.prisma.guildServerStats.delete({
            //     where: {
            //         guild_id: guild.id,
            //         channel_id: selectedChannel.id,
            //     }
            // });
            await GuildServerStats.deleteOne({
                guild_id: guild.id,
                channel_id: selectedChannel.id
            });

            await interaction.reply(new ReplyEmbed().success("ได้ทำลบการตั้งค่า สถานะเซิฟเวอร์ เรียบร้อยเเล้วนะคะ"));
        }
        catch(e){
            console.log(e);
            return await interaction.reply(new ReplyEmbed().error("Internal Server Error"));
        }
    }

};
