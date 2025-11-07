import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, CommandInteraction, EmbedBuilder, Interaction, Message, PermissionsBitField, SlashCommandStringOption, TextChannel, Webhook } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { config } from "../../config/config";
import { GuildMusicChannel } from "../../models/GuildMusicChannel.model";

export default class MusicChannelSetup extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "music-channel-remove",
            description: {
                content: "Remove the channel for request and control player",
                examples: [""],
                usage: "",
            },
            category: "MusicChannel",
            cooldown: 3,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks", "ManageChannels"],
                user: ["Administrator"],
            },
            options: [],
        });
    }

    async callback(client: BotClient, interaction: CommandInteraction): Promise<any> {
        try {
            const findMusicChannel = await GuildMusicChannel.findOne({
                guild_id: interaction.guild?.id
            });

            if(!findMusicChannel){
                return await interaction.reply({
                    content: `🟡 | เอ๊ะ! ไม่พบข้อมูลการตั้งค่าช่องเล่นเพลงเลยนะ`
                });
            }

            // create embed and button
            const embed: EmbedBuilder = new EmbedBuilder()
                .setColor(config.assets.musicChannel.defaultColor)
                .setTitle(`หากต้องการจะลบระบบห้องเพลงให้กด \`ยืนยัน\` \nหากต้องการยกเลิกให้กด \`ยกเลิก\``)
                .setFooter({
                    text: client.user!.username
                })
                .setTimestamp();
            const yesBtn: ButtonBuilder = new ButtonBuilder()
                .setLabel(`ยืนยัน [Accept]`)
                .setCustomId(`yes`)
                .setStyle(ButtonStyle.Success)
                .setEmoji(`✅`);
            const noBtn: ButtonBuilder = new ButtonBuilder()
                .setLabel(`ยกเลิก [Cancel]`)
                .setCustomId(`no`)
                .setStyle(ButtonStyle.Danger)
                .setEmoji(`❌`);
            const btnRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(yesBtn, noBtn);

            await interaction.reply({ 
                embeds: [embed], 
                components: [btnRow],
                ephemeral: true
            });
            const filter = (i: Interaction): i is ButtonInteraction => i.user.id === interaction.member?.user.id;
            const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 30000 });

            if(!collector) return await interaction.deleteReply();
            collector.on('collect', async(i: ButtonInteraction) => {
                if (i.customId === 'yes'){
                    // Delete Webhook
                    const webhook: Webhook = await client.fetchWebhook(findMusicChannel.webhook_id);
                    await webhook.delete();
                    // Delete Channel
                    const musicChannel: TextChannel | undefined = client.channels.cache.get(findMusicChannel.channel_id) as TextChannel | undefined;
                    if(musicChannel){
                        await musicChannel.delete().catch((): void => {});
                    }
                    // Delete From DB
                    await GuildMusicChannel.deleteOne({
                        guild_id: interaction.guild?.id
                    });
                    return await i.update({ 
                        content: '🟢 | ทำการลบการตั้งค่าห้องระบบเพลงเรียบร้อยเเล้วค่ะ', 
                        embeds: [], 
                        components: [],
                    });
                }
                else if(i.customId === 'no'){
                    return await i.update({ 
                        content: '🟢 | ทำการยกเลิกรายการเรียบร้อยค่ะ', 
                        embeds: [], 
                        components: [] 
                    });
                }
            });
        }
        catch(e){
            return interaction.followUp({
                content: "🔴 | ไม่สามารถใช้งานได่ในขณะนี้",
            });
        }
    }    
};
