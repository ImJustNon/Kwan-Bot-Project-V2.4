import { ActionRowBuilder, AnyComponentBuilder, APIEmbedField, APIMessageComponentEmoji, APISelectMenuOption, ApplicationCommandOptionType, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, ChannelType, ChatInputCommandInteraction, Collection, CommandInteraction, ComponentType, EmbedBuilder, Guild, GuildMember, Interaction, InteractionCallbackResponse, InteractionResponse, MessageFlags, RestOrArray, SlashCommandStringOption, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { config } from "../../config/config";
import axios from "axios";
import ReplyEmbed from "../../utils/ReplyEmbed.util";
import { GuildAutoVoiceChannel } from "../../models/GuildAutoVoiceChannel.model";
import { GuildCaptcha } from "../../models/GuildCaptcha.model";

export default class CaptchaConfig extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "captcha-config",
            description: {
                content: "To see server captcha config",
                examples: [""],
                usage: "",
            },
            category: "Captcha",
            cooldown: 3,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks", "ManageChannels", "MoveMembers", "ManageRoles", "Administrator", "KickMembers"],
                user: ["Administrator"],
            },
            options: [],
        });
    }
    async callback(client: BotClient, interaction: ChatInputCommandInteraction): Promise<any>{
        const findCapchaSetup = await GuildCaptcha.findOne({
            guild_id: interaction.guildId,
        });

        if(!findCapchaSetup){
            return await interaction.reply(new ReplyEmbed().warn("เซิฟเวอร์นี้ยังไม่มีการตั้งค่าการยืนยันนะคะ สามารถใช้คำสั่ง `/captcha-setup` เพื่อตั้งค่าได้เลยค่ะ"));
        }

        const embed = new EmbedBuilder()
            .setColor('#ff42f9')
            .setAuthor({
                name: "หน้าต่างการตั้งค่าระบบยืนยันตัวตน",
                iconURL: interaction.guild?.iconURL() ?? ""
            })
            .addFields([
                {
                    name: `:gear: เพิ่มยศอัตโนมัติ :`,
                    value: findCapchaSetup.role_new_id,
                    inline: false,
                },
                {
                    name: `:gear: นำยศออกอัตโนมัติ :`,
                    value: findCapchaSetup.role_old_id ? `@${findCapchaSetup.role_old_id}` : '\❌ ยังไม่ได้ตั้งค่า',
                    inline: false,
                },
                {
                    name: `:gear: เวลายืนยัน :`,
                    value: String(findCapchaSetup.timeout),
                    inline: false,
                },
                {
                    name: `:gear: ผู้ตั้งค่า :`,
                    value: `@${findCapchaSetup.author_id}`,
                    inline: false,
                }
            ])
            .setFooter({
                text: "Kwan's 💕 2"
            })
            .setTimestamp()

        await interaction.reply({
            embeds: [embed],
            flags: [
                MessageFlags.Ephemeral
            ]
        });
    }
};
