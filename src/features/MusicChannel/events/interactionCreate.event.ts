import { ButtonInteraction, CommandInteraction, EmbedBuilder, GuildMember, Interaction, TextChannel, VoiceBasedChannel } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { Player } from "moonlink.js";
import MusicChannelMessage from "../../../utils/MusicChannelMessage.util";
import MusicChannelWebhook from "../../../utils/MusicChannelWebhook.util";

export default class InteractionCreate {
    constructor(client: BotClient) {
        client.on("interactionCreate", async(interaction: Interaction) => {
            // create commandInteraction for save interaction but in CommandInteraction Type
            const commandInteraction: CommandInteraction = interaction as CommandInteraction;

            // check is button interaction 
            if(!interaction.isButton()) return;

            // filter channel from name
            if(!(interaction.channel instanceof TextChannel)) return;
            if(!interaction.channel.name.includes("music") && !interaction.channel.name.includes(`${client.user?.username}-music`) && !interaction.channel.name.includes(`${client.user?.username}`)) return;


            // check channel from database
            const findMusicChannel = await client.prisma.guildMusicChannel.findUnique({
                where: {
                    guild_id: interaction.guild?.id,
                    channel_id: interaction.channel?.id
                },
                select: {
                    content_banner_id: true,
                    content_playing_id: true,
                    content_queue_id: true,
                    webhook_id: true,
                    webhook_token: true,
                }
            });
            if(!findMusicChannel) return;


            // check player is still playing?
            const player: Player | undefined = client.manager.players.get(interaction.guildId || "");
            if(!player || !player.queue){
                return commandInteraction.reply({
                    content: '🟡 | ยังไม่มีการเล่นเพลง ณ ตอนนี้เลยน่ะ',
                    ephemeral: true,
                });
            }

            // check is user connect voice channel?
            const member: GuildMember = interaction.member as GuildMember;
            const voiceChannel: VoiceBasedChannel | null = member.voice.channel;
            if(!voiceChannel){
                return commandInteraction.reply({
                    content: '🟡 | โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ',
                    ephemeral: true,
                });
            }

            // check if bot is in use by another channel
            const bot: GuildMember | undefined = interaction.guild?.members.cache.get(client.user!.id);
            if(bot?.voice.channel && !voiceChannel.equals(bot.voice.channel)){
                return member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription('🔴 | ตอนนี้มีคนกำลังใช้งานอยู่น่ะ')
                            .setColor("Red")
                            .setFooter({ 
                                text: client.user!.username 
                            })
                            .setTimestamp(),
                    ],
                }).then(async msg =>{
                    await msg.react('🚫').catch(err => console.log(err));
                    setTimeout(async() =>{
                        await msg.delete();
                    }, 15000);
                });
            }

            // create buttonInteraction for save interaction but in buttonInteraction Type
            const buttonInteraction: ButtonInteraction = interaction as ButtonInteraction;

            // setup webhook for music channel
            const webhook: MusicChannelWebhook = new MusicChannelWebhook(findMusicChannel.webhook_id, findMusicChannel.webhook_token);

            if(buttonInteraction.customId === 'music_pause'){
                if(!player.paused){
                    player.pause();
                    await commandInteraction.reply('🟢 | ทำการหยุดเพลงชั่วคราวเรียบร้อยเเล้วค่ะ').then(async(): Promise<void> => { 
                        setTimeout(async() =>{
                            await commandInteraction.deleteReply();
                        }, 5000);
                    });
                }
                else if(player.paused){
                    player.resume();
                    await commandInteraction.reply('🟢 | ทำการเล่นเพลงต่อเเล้วค่ะ').then(async(): Promise<void> => { 
                        setTimeout(async() =>{
                            await commandInteraction.deleteReply();
                        }, 5000); 
                    });
                } 
            }
            else if(buttonInteraction.customId === 'music_skip'){
                await player.skip();
                await commandInteraction.reply('🟢 | ทำการข้ามเพลงให้เรียบร้อยเเล้วค่ะ').then(async(): Promise<void> => { 
                    setTimeout(async() =>{
                        await commandInteraction.deleteReply();
                    }, 5000); 
                });
            }
            else if(buttonInteraction.customId === 'music_stop'){
                if(player.playing){
                    player.destroy();
                    await commandInteraction.reply('🟢 | ทำการปิดเพลงเรียบร้อยเเล้วค่ะ').then(async(): Promise<void> => { 
                        setTimeout(async() =>{
                            await commandInteraction.deleteReply();
                        }, 5000); 
                    });
                }
            }
            else if(buttonInteraction.customId === 'music_loop'){
                if(player.loop === "off"){
                    await player.setLoop("queue");
                    await commandInteraction.reply(`🟢 | ทำการเปิดการวนซ้ำเพลงเเบบ \`ทั้งหมด\` เรียบร้อยเเล้วค่ะ`).then(async(): Promise<void> =>{ 
                        await webhook.editEmbedTrack(client, player, findMusicChannel.content_playing_id);
                        setTimeout(async() =>{
                            await commandInteraction.deleteReply();
                        }, 5000); 
                    });
                }
                else if(player.loop === "queue"){
                    await player.setLoop("track");
                    await commandInteraction.reply(`🟢 | ทำการเปิดการวนซ้ำเพลงเเบบ \`เพลงเดียว\` เรียบร้อยเเล้วค่ะ`).then(async(): Promise<void> =>{ 
                        await webhook.editEmbedTrack(client, player, findMusicChannel.content_playing_id);
                        setTimeout(async() =>{
                            await commandInteraction.deleteReply();
                        }, 5000); 
                    });
                }
                else if(player.loop === "track"){
                    await player.setLoop("off");
                    await commandInteraction.reply(`🟢 | ทำการปิดวนซ้ำเพลงเรียบร้อยเเล้วค่ะ`).then(async(): Promise<void> =>{ 
                        await webhook.editEmbedTrack(client, player, findMusicChannel.content_playing_id);
                        setTimeout(async() =>{
                            await commandInteraction.deleteReply();
                        }, 5000); 
                    });
                }
            }
            else if(buttonInteraction.customId === 'music_shuffle'){
                if(!player.queue || !player.queue.size || player.queue.size == 0){
                    await commandInteraction.reply('🟡 | เอ๊ะ! ดูเหมือนว่าคิวของคุณจะไม่มีความยาวมากพอน่ะคะ').then(async(): Promise<void> =>{ 
                        setTimeout(async() =>{
                            await commandInteraction.deleteReply();
                        }, 5000); 
                    });
                }
                else{
                    await player.queue.shuffle();
                    await commandInteraction.reply('🟢 | ทำการสุ่มเรียงรายการคิวใหม่เรียบร้อยเเล้วค่ะ').then(async(): Promise<void> =>{ 
                        await webhook.editQueueTrack(client, player, findMusicChannel.content_queue_id);
                        setTimeout(async() =>{
                            await commandInteraction.deleteReply();
                        }, 5000); 
                    });
                }
            }
            else if(buttonInteraction.customId === 'music_volup'){
                let newVol: number = player.volume + 10;
                if(newVol < 110){
                    await player.setVolume(newVol);
                    await commandInteraction.reply(`🟢 | ทำการปรับความดังเสียงเป็น \`${newVol}\` เรียบร้อยเเล้วค่ะ`).then(async(): Promise<void> =>{ 
                        await webhook.editEmbedTrack(client, player, findMusicChannel.content_playing_id);
                        setTimeout(async() =>{
                            await commandInteraction.deleteReply();
                        }, 5000); 
                    });
                }
                else if(newVol >= 110){
                    await commandInteraction.reply(`🟡 | ไม่สามารถปรับความดังเสียงได้มากกว่านี้เเล้วค่ะ`).then(async(): Promise<void> =>{ 
                        setTimeout(async() =>{
                            await commandInteraction.deleteReply();
                        }, 5000); 
                    });
                }
            }
            else if(buttonInteraction.customId === 'music_voldown'){
                let newVol: number = player.volume - 10;
                if(newVol > 0){
                    await player.setVolume(newVol);
                    await commandInteraction.reply(`🟢 | ทำการปรับความดังเสียงเป็น \`${newVol}\` เรียบร้อยเเล้วค่ะ`).then(async(): Promise<void> =>{ 
                        await webhook.editEmbedTrack(client, player, findMusicChannel.content_playing_id);
                        setTimeout(async() =>{
                            await commandInteraction.deleteReply();
                        }, 5000); 
                    });
                }   
                else if(newVol < 0){
                    await commandInteraction.reply(`🟡 | ไม่สามารถปรับความดังเสียงได้น้อยกว่านี้เเล้วค่ะ`).then(async(): Promise<void> =>{ 
                        setTimeout(async() =>{
                            await commandInteraction.deleteReply();
                        }, 5000); 
                    });
                } 
            }
            else if(buttonInteraction.customId === 'music_mute'){
                if(player.volume > 0){
                    await player.setVolume(0);
                    await commandInteraction.reply(`🟢 | ทำการปิดเสียงเรียบร้อยเเล้วค่ะ`).then(async(): Promise<void> =>{ 
                        await webhook.editEmbedTrack(client, player, findMusicChannel.content_playing_id);
                        setTimeout(async() =>{
                            await commandInteraction.deleteReply();
                        }, 5000); 
                    });
                }
                else if(player.volume === 0){
                    await player.setVolume(80);
                    await commandInteraction.reply(`🟢 | ทำการเปิดเสียงเรียบร้อยเเล้วค่ะ`).then(async(): Promise<void> =>{ 
                        await webhook.editEmbedTrack(client, player, findMusicChannel.content_playing_id);
                        setTimeout(async() =>{
                            await commandInteraction.deleteReply();
                        }, 5000); 
                    });
                }
            }
        });
    }
}