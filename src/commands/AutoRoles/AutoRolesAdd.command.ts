import { ActionRowBuilder, AnyComponentBuilder, APIEmbedField, APIMessageComponentEmoji, APISelectMenuOption, ApplicationCommandOptionType, CacheType, ChannelType, ChatInputCommandInteraction, Collection, CommandInteraction, ComponentType, EmbedBuilder, Guild, GuildMember, Interaction, InteractionCallbackResponse, InteractionResponse, MessageFlags, RestOrArray, SlashCommandStringOption, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { config } from "../../config/config";
import axios from "axios";
import ReplyEmbed from "../../utils/ReplyEmbed.util";
import { GuildAutoRoles } from "../../models/GuildAutoRoles.model";

export default class AutoRolesAdd extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "autoroles-add",
            description: {
                content: "Add Roles to new member when joined",
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
                    description: `เลือกยศที่ต้องการจะเพิ่ม`,
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
            const findAutoRoles = await GuildAutoRoles.find({
                guild_id: guild.id,
            });

            if(findAutoRoles.filter(r => r.role_id === selectedRole.id).length !== 0) return await interaction.reply(new ReplyEmbed().warn("Role นี้ได้ถูกตั้งค่าเป็น Auto Role ไว้เเล้วนะคะ"));

            if(findAutoRoles.length >= 5) return await interaction.reply(new ReplyEmbed().warn(`สามารถตั้งค่าได้สูงสุด 5 ยศเท่านั้นนะคะ`));

            await GuildAutoRoles.create({
                guild_id: guild.id,
                role_id: selectedRole.id,
                author_id: member.id
            });

            await interaction.reply(new ReplyEmbed().success(`ทำการเพิ่มยศ <@&${selectedRole.id}> เรียบร้อยเล้วค่ะ`));
        }
        catch(e){
            return await interaction.reply(new ReplyEmbed().error("Internal Server Error"));
        }
    }
};
