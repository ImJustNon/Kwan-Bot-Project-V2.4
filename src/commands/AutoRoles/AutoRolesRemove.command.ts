import { ActionRowBuilder, AnyComponentBuilder, APIEmbedField, APIMessageComponentEmoji, APISelectMenuOption, ApplicationCommandOptionType, CacheType, ChannelType, ChatInputCommandInteraction, Collection, CommandInteraction, ComponentType, EmbedBuilder, Guild, GuildMember, Interaction, InteractionCallbackResponse, InteractionResponse, MessageFlags, RestOrArray, SlashCommandStringOption, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { config } from "../../config/config";
import axios from "axios";
import ReplyEmbed from "../../utils/ReplyEmbed.util";

export default class AutoRolesAdd extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "autoroles-remove",
            description: {
                content: "Remove Role from Auto Role",
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
            options: [
                {
                    name: "role",
                    description: `เลือกยศที่ต้องการจะนำออก`,
                    type: ApplicationCommandOptionType.Role,
                    required: true,
                },
            ],
        });
    }
    async callback(client: BotClient, interaction: ChatInputCommandInteraction): Promise<any>{
        const selectedRole = interaction.options.getRole("role");
        const guild: Guild | undefined = client.guilds.cache.get(interaction.guildId || "");
        const member: GuildMember | undefined = guild?.members.cache.get(interaction.member?.user.id || "");

        if(!selectedRole) return;
        if(!guild) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล Guild ที่อยู่ตอนนี้"));
        if(!member) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล User ที่ใช้อยู่ตอนนี้"));
        
        try {
            const findAutoRoles = await client.prisma.guildAutoRoles.findUnique({
                where: {
                    guild_id: guild.id,
                    role_id: selectedRole.id
                },
                select: {
                    role_id: true
                }
            });

            if(!findAutoRoles) return await interaction.reply(new ReplyEmbed().warn("Role นี้ยังไม่ได้ถูกตั้งค่าเป็น Auto Role นะคะ"));


            await client.prisma.guildAutoRoles.delete({
                where: {
                    guild_id: guild.id,
                    role_id: selectedRole.id
                }
            });

            await interaction.reply(new ReplyEmbed().success(`ทำการนำยศ <@&${selectedRole.id}> ออกเรียบร้อยเล้วค่ะ`));
        }
        catch(e){
            return await interaction.reply(new ReplyEmbed().error("Internal Server Error"));
        }
    }
};
