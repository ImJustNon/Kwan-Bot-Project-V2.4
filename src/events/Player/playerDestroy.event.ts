import { INode, Player, Track, TTrackEndType } from "moonlink.js";
import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";
import { EmbedBuilder, Message, TextChannel, VoiceChannel } from "discord.js";
import MusicChannelMessage from "../../utils/MusicChannelMessage.util";
import ConvertTime from "../../utils/convertTime.util";
import MusicChannelDefaultMessage from "../../utils/MusicChannelDefaultMessage.util";
import MusicChannelWebhook from "../../utils/MusicChannelWebhook.util";

export default class PlayerDestroy extends Event {
    constructor(client: BotClient, file: string) {
        super(client, file, {
            name: "playerDestroyed",
            type: "player"
        });
    }

    async callback(player: Player) {
        // always disconnect after destroy player
        // if(player.connected){
        //     player.disconnect();
        // }

        // set to default data when player got destroy

        const textChannel: TextChannel = this.client.channels.cache.get(player.textChannelId) as TextChannel;
        if(!textChannel.name.includes("music") && !textChannel.name.includes(`${this.client.user?.username}-music`) && !textChannel.name.includes(`${this.client.user?.username}`)) return;

        // then check from db
        try {
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


            if(!findMusicChannel) return; // if isnt music channel will ignore
    
    
            const webhook: MusicChannelWebhook = new MusicChannelWebhook(findMusicChannel.webhook_id, findMusicChannel.webhook_token);
            await webhook.editQueueDefault(findMusicChannel.content_queue_id);
            await webhook.editEmbedDefault(findMusicChannel.content_playing_id);
        }
        catch(e){
            console.log(`[Error] `, e);
        }
    }
}