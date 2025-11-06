import { EmbedBuilder, Guild, GuildMember, PartialGuildMember, Role } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import ReplyEmbed from "../../../utils/ReplyEmbed.util";
import { ServerStatsPrefix } from "../../../enums/ServerStats.enum";
import UpdateData from "../../../utils/UpdateData.utils";
import { GuildServerStats } from "../../../models/GuildServerStats.model";

export default class GuildMemberRemove {
    constructor(client: BotClient){
        client.on("guildMemberRemove", async(member: GuildMember | PartialGuildMember) => {
            try {
                // const findStatusChannel = await client.prisma.guildServerStats.findMany({
                //     where: {
                //         guild_id: member.guild.id,
                //         prefix: {
                //             in: [
                //                 ServerStatsPrefix.CountMembersUsers,
                //                 ServerStatsPrefix.CountMembersBots,
                //                 ServerStatsPrefix.CountMembersAll
                //             ]
                //         }
                //     }
                // });
                const findStatusChannel = await GuildServerStats.find({
                    guild_id: member.guild.id,
                    prefix: {
                        in: [
                            ServerStatsPrefix.CountMembersUsers,
                            ServerStatsPrefix.CountMembersBots,
                            ServerStatsPrefix.CountMembersAll
                        ]
                    }
                }); 

                if(findStatusChannel.length === 0) return;

                for(const ch of findStatusChannel){
                    const channel = member.guild.channels.cache.get(ch.channel_id);
                    if(!channel) continue;

                    await channel.setName(new UpdateData(client, member.guild, ch.channel_name).getResult()).catch((e) => {});
                }
            }
            catch(e){}
        }); 
    }
}