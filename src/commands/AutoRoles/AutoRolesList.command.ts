import { ActionRowBuilder, AnyComponentBuilder, APIEmbedField, APIMessageComponentEmoji, APISelectMenuOption, ApplicationCommandOptionType, CacheType, ChannelType, ChatInputCommandInteraction, Collection, CommandInteraction, ComponentType, EmbedBuilder, Guild, GuildMember, Interaction, InteractionCallbackResponse, InteractionResponse, MessageFlags, RestOrArray, SlashCommandStringOption, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { config } from "../../config/config";
import axios from "axios";
import ReplyEmbed from "../../utils/ReplyEmbed.util";

export default class AutoRolesAdd extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "autoroles-list",
            description: {
                content: "List all role of Auto Roles",
                examples: [""],
                usage: "",
            },
            category: "AutoRoles",
            cooldown: 3,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks", "ManageRoles"],
                user: ["Administrator"],
            },
            options: [],
        });
    }
    async callback(client: BotClient, interaction: ChatInputCommandInteraction): Promise<any>{
        const guild: Guild | undefined = client.guilds.cache.get(interaction.guildId || "");
        
        if(!guild) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล Guild ที่อยู่ตอนนี้"));

        try {
            const findAutoRoles = await client.prisma.guildAutoRoles.findMany({
                where: {
                    guild_id: guild.id
                },
                select: {
                    role_id: true,
                    creator_user_id: true
                }
            });

            if(findAutoRoles.length === 0) return await interaction.reply(new ReplyEmbed().warn('ไม่พบการตั้งค่า Auto Roles ใน Guild นี้นะตะ'));

            const embed: EmbedBuilder = new EmbedBuilder().setColor(config.assets.embed.default.color).setTitle(`⚙️ | รายการยศที่ตั้งค่าเป็นยศอัตโนมัติ`).setFooter({text: client.user?.username ?? ""}).setTimestamp();
            for(const role of findAutoRoles){
                embed.addFields({
                    name: `ยศ : <@&${role.role_id}>`,
                    value: `ตั้งค่าโดย : <@${role.creator_user_id}>`,
                    inline: true
                });
            }
            
            await interaction.reply({ 
                embeds: [ embed ],
            });
        }
        catch(e){
            return interaction.reply(new ReplyEmbed().error(`Internal Server Error`));
        }
    }
};
