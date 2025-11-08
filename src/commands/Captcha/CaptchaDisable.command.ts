import { ActionRowBuilder, AnyComponentBuilder, APIEmbedField, APIMessageComponentEmoji, APISelectMenuOption, ApplicationCommandOptionType, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, ChannelType, ChatInputCommandInteraction, Collection, CommandInteraction, ComponentType, EmbedBuilder, Guild, GuildMember, Interaction, InteractionCallbackResponse, InteractionResponse, MessageFlags, RestOrArray, SlashCommandStringOption, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { config } from "../../config/config";
import axios from "axios";
import ReplyEmbed from "../../utils/ReplyEmbed.util";
import { GuildAutoVoiceChannel } from "../../models/GuildAutoVoiceChannel.model";
import { GuildCaptcha } from "../../models/GuildCaptcha.model";

export default class CaptchaDisable extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "captcha-disable",
            description: {
                content: "To disable server captcha",
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
            options: [
                {
                    name: "confirm",
                    description: `ยืนยัน`,
                    type: ApplicationCommandOptionType.Boolean,
                    required: true,
                },
            ],
        });
    }
    async callback(client: BotClient, interaction: ChatInputCommandInteraction): Promise<any>{
        const isConfirm = interaction.options.getBoolean('confirm')!;


        if(!isConfirm){
            return await interaction.reply(new ReplyEmbed().success("หากต้องการปิดการใช้งานให้เลือก `true` นะคะ"));
        }

        const findCapchaSetup = await GuildCaptcha.findOne({
            guild_id: interaction.guildId,
        });

        if(!findCapchaSetup){
            return await interaction.reply(new ReplyEmbed().warn("เซิฟเวอร์นี้ยังไม่มีการตั้งค่าการยืนยันนะคะ สามารถใช้คำสั่ง `/captcha-setup` เพื่อตั้งค่าได้เลยค่ะ"));
        }

        await GuildCaptcha.deleteMany({
            guild_id: interaction.guildId
        });

        await interaction.reply(new ReplyEmbed().success("ปิดการใช้งานระบบยืนยันเรียบร้อยเเล้วค่ะ"));
        
    }
};
