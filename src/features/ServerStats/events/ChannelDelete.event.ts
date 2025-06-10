import { DMChannel, EmbedBuilder, Guild, GuildMember, NonThreadGuildBasedChannel, PartialGuildMember, Role } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import ReplyEmbed from "../../../utils/ReplyEmbed.util";
import { ServerStatsPrefix } from "../../../enums/ServerStats.enum";
import UpdateData from "../../../utils/UpdateData.utils";

export default class ChannelDelete {
    constructor(client: BotClient){
        client.on("channelDelete", async(channel: DMChannel | NonThreadGuildBasedChannel) => {

            if(channel.isDMBased()) return;
            // console.log(channel.guild);

            try {
                const findStatusChannel = await client.prisma.guildServerStats.findMany({
                    where: {
                        guild_id: channel.guild.id,
                        prefix: {
                            in: [
                                ServerStatsPrefix.CountChannelsVoice,
                                ServerStatsPrefix.CountChannelsText,
                            ]
                        }
                    }
                });

                if(findStatusChannel.length === 0) return;

                for(const ch of findStatusChannel){
                    const updateCH = channel.guild.channels.cache.get(ch.channel_id);
                    if(!updateCH) continue;

                    await updateCH.setName(new UpdateData(client, channel.guild, ch.channel_name).getResult()).catch((e) => {});
                }
            }
            catch(e){}
        }); 
    }
}