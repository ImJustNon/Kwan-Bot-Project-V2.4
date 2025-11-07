import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, Channel, ChannelType, CommandInteraction, EmbedBuilder, Interaction, Message, PermissionsBitField, SlashCommandStringOption, TextChannel, Webhook, WebhookType } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { config } from "../../config/config";
import { GuildMusicChannel } from "../../models/GuildMusicChannel.model";

export default class MusicChannelSetup extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "music-channel-setup",
            description: {
                content: "Setup the channel for request and control player",
                examples: [""],
                usage: "",
            },
            category: "MusicChannel",
            cooldown: 3,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks", "ManageChannels", "ManageWebhooks"],
                user: ["Administrator"],
            },
            options: [],
        });
    }

    async callback(client: BotClient, interaction: CommandInteraction): Promise<any> {
        await interaction.reply({
            content: "⌛ | กำลังตั้งค่าห้องเล่นเพลง กรุณารอซักครู่น่ะ",
        });

        try {
            const guildId: string | undefined = interaction.guild?.id;
            const findCurrentData = await GuildMusicChannel.findOne({
                guild_id: guildId
            });

            if(findCurrentData){
                return await interaction.editReply({
                    content: "🟡 | เซิฟเวอร์นี้ได้่สร้างช่องไว้เเล้ว หากต้องการสร้างใหม่ให้ทำการลบด้วยคำสั่ง `/music-remove`",
                });
            }

            await this.setupChannel(client, interaction);
            await interaction.editReply("🟢 | ทำการตั้งค่า เรียบร้อยเเล้ว");
            
        }
        catch(e){
            console.log(e);
            return interaction.followUp({
                content: "🔴 | ไม่สามารถใช้งานได่ในขณะนี้"
            });
        }
    }


    async setupChannel(client: BotClient, interaction: CommandInteraction){
        await interaction.guild?.channels.create({
            name: `${client.user?.username}-music`,
            type: ChannelType.GuildText,
            parent: null,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.UseApplicationCommands]
                }
            ]
        }).then(async(ch: TextChannel) => {
            await this.setupWebhook(client, interaction, ch);
        });
    }

    async setupWebhook(client: BotClient, interaction: CommandInteraction, ch: TextChannel){
        try {
            // Create a webhook in the channel
            const webhook: Webhook<WebhookType.Incoming> = await ch.createWebhook({
                name: client.user!.username,
                avatar: client.user?.displayAvatarURL(),  
            });

            await this.setupDefaultMessage(client, interaction, ch, webhook);
        }
        catch(e){
            console.log(e);
            return interaction.followUp({
                content: "🔴 | ไม่สามารถใช้งานได่ในขณะนี้"
            });
        }
    }

    async setupDefaultMessage(client: BotClient, interaction: CommandInteraction, ch: TextChannel, webhook: Webhook<WebhookType.Incoming>){
        const channelId: string = ch.id;
        const authorId: string | undefined= interaction.member?.user.id;
        const guildId: string | undefined = interaction.guild?.id;

        await ch.setTopic(`play_pause: | หยุดเพลง หรือ เล่นเพลงต่อ :track_next: | ข้ามเพลง :stop_button: | ปิดเพลง :repeat: | เปิด/ปิด การใช้งานวนซ้ำ :twisted_rightwards_arrows: | สลับคิวเพลง :sound: | ลดเสียง :loud_sound: | เพิ่มเสียง :speaker: | ปิด/เปิดเสียง`);

        let contentBannerId: string = "";
        let contentqueueId: string = "";
        let contentCurrentId: string = "";

        await webhook.send({
            content: config.assets.musicChannel.bannerUrl,
        }).then((msg: Message) => contentBannerId = msg.id);

        await webhook.send({
            content: "**คิวเพลง:** \nเข้าช่องเสียง และพิมพ์ชื่อเพลงหรือลิงก์ของเพลง เพื่อเปิดเพลงน่ะ "
        }).then((msg: Message) => contentqueueId = msg.id);

        await webhook.send({
            embeds: [
                new EmbedBuilder().setColor(config.assets.musicChannel.defaultColor).setTitle("ยังไม่มีเพลงเล่นอยู่ ณ ตอนนี้").setImage(config.assets.musicChannel.defaultUrl).setFooter({ text: "ใช้ /help สำหรับคำสั่งเพิ่มเติม" }).setTimestamp(),
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder().setCustomId(`music_pause`).setStyle(ButtonStyle.Success).setEmoji(`⏯`),
                    new ButtonBuilder().setCustomId(`music_skip`).setStyle(ButtonStyle.Secondary).setEmoji(`⏭`),
                    new ButtonBuilder().setCustomId(`music_stop`).setStyle(ButtonStyle.Danger).setEmoji(`⏹`),
                    new ButtonBuilder().setCustomId(`music_loop`).setStyle(ButtonStyle.Secondary).setEmoji(`🔁`),
                    new ButtonBuilder().setCustomId(`music_shuffle`).setStyle(ButtonStyle.Success).setEmoji(`🔀`),
                ), 
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder().setCustomId(`music_volup`).setLabel(`เพิ่มเสียง`).setStyle(ButtonStyle.Primary).setEmoji(`🔊`),
                    new ButtonBuilder().setCustomId(`music_voldown`).setLabel(`ลดเสียง`).setStyle(ButtonStyle.Primary).setEmoji(`🔉`),
                    new ButtonBuilder().setCustomId(`music_mute`).setLabel(`ปิด/เปิดเสียง`).setStyle(ButtonStyle.Primary).setEmoji(`🔈`),
                ),
            ],
        }).then((msg: Message) => contentCurrentId = msg.id);

        await GuildMusicChannel.create({
            guild_id: guildId as string,
            channel_id: channelId,
            webhook_id: webhook.id,
            webhook_token: webhook.token,
            author_id: interaction.user.id,
            content_banner_id: contentBannerId,
            content_queue_id: contentqueueId,
            content_playing_id: contentCurrentId
        }).catch(e => {
            return interaction.followUp({
                content: "🔴 | ไม่สามารถใช้งานได่ในขณะนี้",
            });
        });
    }    
};
