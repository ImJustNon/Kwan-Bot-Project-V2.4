import { EmbedBuilder, Guild, GuildMember, NonThreadGuildBasedChannel, PartialGuildMember, Role } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import ReplyEmbed from "../../../utils/ReplyEmbed.util";
import { ServerStatsPrefix } from "../../../enums/ServerStats.enum";
import UpdateData from "../../../utils/UpdateData.utils";
import { GuildServerStats } from "../../../models/GuildServerStats.model";

export default class ChannelCreate {
    constructor(client: BotClient){
        client.on("channelCreate", async(channel: NonThreadGuildBasedChannel) => {
            try {
                // const findStatusChannel = await client.prisma.guildServerStats.findMany({
                //     where: {
                //         guild_id: channel.guild.id,
                //         prefix: {
                //             in: [
                //                 ServerStatsPrefix.CountChannelsVoice,
                //                 ServerStatsPrefix.CountChannelsText,
                //             ]
                //         }
                //     }
                // });
                const findStatusChannel = await GuildServerStats.find({
                    guild_id: channel.guild.id,
                    prefix: {
                        $in: [
                            ServerStatsPrefix.CountChannelsVoice,
                            ServerStatsPrefix.CountChannelsText,
                        ]
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