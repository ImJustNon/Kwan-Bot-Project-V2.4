import { ActionRowBuilder, AnyComponentBuilder, APIEmbedField, APIMessageComponentEmoji, APISelectMenuOption, ApplicationCommandOptionType, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, ChannelType, ChatInputCommandInteraction, Collection, CommandInteraction, ComponentType, EmbedBuilder, Guild, GuildMember, Interaction, InteractionCallbackResponse, InteractionResponse, MessageFlags, RestOrArray, SlashCommandStringOption, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { config } from "../../config/config";
import axios from "axios";
import ReplyEmbed from "../../utils/ReplyEmbed.util";
import { GuildAutoVoiceChannel } from "../../models/GuildAutoVoiceChannel.model";
import { GuildCaptcha } from "../../models/GuildCaptcha.model";

export default class CaptchaSetup extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "captcha-setup",
            description: {
                content: "To verify your new member",
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
                    name: "timeout",
                    description: `เวลาให้ยืนยัน (วินาที)`,
                    type: ApplicationCommandOptionType.Number,
                    maxValue: 60,
                    minValue: 10,
                    required: true,
                },
                {
                    name: "verified-role",
                    description: "ยศสำหรับสมาชิกที่ยืนยันเเล้ว",
                    type: ApplicationCommandOptionType.Role,
                    required: true
                },
                {
                    name: "unverified-role",
                    description: `ยศที่จะถูกเพิ่มอัตโนมัติ เเละจะถูกนำออกหลังยืนยันสำเร็จ`,
                    type: ApplicationCommandOptionType.Role,
                    required: false,
                },
            ],
        });
    }
    async callback(client: BotClient, interaction: ChatInputCommandInteraction): Promise<any>{
        const verifiedRole = interaction.options.getRole('verified-role')!;
        const unverifiedRole = interaction.options.getRole('unverified-role');
        const timeout = interaction.options.getNumber('timeout')! * 1000;



        const findCapchaSetup = await GuildCaptcha.findOne({
            guild_id: interaction.guildId
        });
        if(findCapchaSetup){
            return await interaction.reply(new ReplyEmbed().warn("เซิฟเวอร์นี้ได้ตั้งค่าระบบยืนยันตัวตนไว้เเล้วนะคะ"));
        }

        
        const embed = new EmbedBuilder()
            .setColor('#e1ff00ff')
            .setTitle(`หากต้องการจะตั้งค่าระบบยืนยันตัวตนให้กด \`ยืนยัน\` \nหากต้องการยกเลิกให้กด \`ยกเลิก\``)
            .setFooter({text: "Kwan's 💕 2"})
            .setTimestamp();

        const yes = new ButtonBuilder()
            .setLabel(`ยืนยัน [Accept]`)
            .setCustomId(`yes`)
            .setStyle(ButtonStyle.Success)
            .setEmoji(`✅`);
        const no = new ButtonBuilder()
            .setLabel(`ยกเลิก [Cancel]`)
            .setCustomId(`no`)
            .setStyle(ButtonStyle.Primary)
            .setEmoji(`❌`);
        const row = new ActionRowBuilder<ButtonBuilder>() 
            .addComponents(yes,no);

        const msg = await interaction.reply({
            embeds: [embed],
            components: [row]
        });

        const collector = msg.createMessageComponentCollector({ 
            filter: button => button.user.id === interaction.user.id,
            time : 30000 
        });
        collector.on("collect", async (b: ButtonInteraction)  => {
            if(b.customId == 'yes'){
                await GuildCaptcha.create({
                    guild_id: interaction.guildId,
                    role_new_id: verifiedRole.id,
                    role_old_id: unverifiedRole ? unverifiedRole.id : null,
                    author_id: interaction.user.id,
                    timeout: timeout
                });
                await b.reply(':white_check_mark: ทำการตั้งค่าระบบยืนยันตัวตนเสร็จเรียบร้อยเเล้วค่ะ');
                await msg.delete();
            }
            if(b.customId == 'no'){
                await b.reply('ทำการยกเลิกรายการเรียบร้อยค่ะ');
                await msg.delete();
            }
        });

    }
};
