import { INode, Player, Track, TTrackEndType } from "moonlink.js";
import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";
import { EmbedBuilder, Message, TextChannel } from "discord.js";
import { config } from "../../config/config";
import { GuildMusicChannel } from "../../models/GuildMusicChannel.model";

export default class QueueEnd extends Event {
    constructor(client: BotClient, file: string) {
        super(client, file, {
            name: "queueEnd",
            type: "player"
        });
    }

    async callback(player: Player, track: Track) {
        const channel: TextChannel = this.client.channels.cache.get(player.textChannelId) as TextChannel;
        // const guild: Guild = client.guilds.cache.get(player.guildId) as Guild;
        try {

            const isMusicChannel = await GuildMusicChannel.findOne({
                guild_id: player.guildId,
                channel_id: player.textChannelId,
            });

            // send queue end message
            const msg: Message = await channel.send({ 
                embeds: [ 
                    new EmbedBuilder()
                        .setColor(config.assets.musicChannel.defaultColor)
                        .setTitle('💤 | คิวหมดเเล้วน่ะ'),
                ] 
            });

            // if send in music channel will remove after 5 sec.
            if(isMusicChannel){
                setTimeout(async() => {
                    await msg.delete();
                }, 5000);
            }
        }
        catch(e){
            console.log("[Error] ", e);
        }

        player.destroy();
    }   
}