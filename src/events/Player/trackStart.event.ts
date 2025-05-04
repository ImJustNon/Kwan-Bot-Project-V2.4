import { INode, Player, Track, TTrackEndType } from "moonlink.js";
import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";
import { EmbedBuilder, Message, TextChannel, VoiceChannel } from "discord.js";
import MusicChannelMessage from "../../utils/MusicChannelMessage.util";
import ConvertTime from "../../utils/convertTime.util";
import MusicChannelWebhook from "../../utils/MusicChannelWebhook.util";

export default class TrackStart extends Event {
    constructor(client: BotClient, file: string) {
        super(client, file, {
            name: "trackStart",
            type: "player"
        });
    }

    async callback(player: Player, track: Track) {
        const channel: TextChannel = this.client.channels.cache.get(player.textChannelId) as TextChannel;
        const voice: VoiceChannel = this.client.channels.cache.get(player.voiceChannelId) as VoiceChannel; 

        const findMusicChannel = await this.client.prisma.guildMusicChannel.findUnique({
            where: {
                guild_id: player.guildId,
                channel_id: player.textChannelId
            },
            select: {
                content_banner_id: true,
                content_queue_id: true,
                content_playing_id: true,
                webhook_id: true,
                webhook_token: true,
            }
        });

        if(findMusicChannel){

            const webhook: MusicChannelWebhook = new MusicChannelWebhook(findMusicChannel.webhook_id, findMusicChannel.webhook_token);
            await webhook.editQueueTrack(this.client, player, findMusicChannel.content_queue_id);
            await webhook.editEmbedTrack(this.client, player, findMusicChannel.content_playing_id);
        }
        else {
            await channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Random")
                    .setThumbnail(track.artworkUrl ?? null)
                    .addFields(
                        [
                            {
                                name: `🎵 | กำลังเล่นเพลง`,
                                value: `[${track.title}](${track.url})`, 
                                inline: false,
                            },
                            {
                                name: `🏡 | ในห้อง`,
                                value: `<#${voice.id}>`, 
                                inline: true,
                            },
                            {
                                name: `⏲️ | ความยาว`,
                                value: `\`${new ConvertTime().convertTime(track.duration)}\``, 
                                inline: true,
                            },
                            {
                                name: `📥 | ขอเพลงโดย`,
                                value: `${track.requestedBy?.toString}`, 
                                inline: true,
                            },
                        ],
                    )
                    .setFooter({text: this.client.user?.username ?? ""})
                    .setTimestamp()
                ],
            });
        }
    }
}