import { EmbedBuilder, Guild, GuildMember, PartialGuildMember, Presence, Role } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import ReplyEmbed from "../../../utils/ReplyEmbed.util";
import { ServerStatsPrefix } from "../../../enums/ServerStats.enum";
import UpdateData from "../../../utils/UpdateData.utils";

export default class PresenceUpdate {
    constructor(client: BotClient){
        client.on("presenceUpdate", async(oldPresence: Presence | null, newPresence: Presence) => {

            if(oldPresence?.status === newPresence.status) return;

            const guild = newPresence.guild;
            if (!guild) return;
            
            try {
                await guild.members.fetch();

                const findStatusChannel = await client.prisma.guildServerStats.findMany({
                    where: {
                        guild_id: guild.id,
                        prefix: {
                            in: [
                                ServerStatsPrefix.CountMembersOnline,
                                ServerStatsPrefix.CountMembersDnd,
                                ServerStatsPrefix.CountMembersIdle,
                                ServerStatsPrefix.CountMembersOffline
                            ]
                        }
                    }
                });
                // console.log("Channels to update:", findStatusChannel.length);

                for (const ch of findStatusChannel) {
                    let channel = guild.channels.cache.get(ch.channel_id);

                    // Try to fetch if not in cache
                    if (!channel) {
                        try {
                            const fetched = await guild.channels.fetch(ch.channel_id);
                        if (fetched) {
                            channel = fetched;
                        } else {
                            // console.warn(`Channel with ID ${ch.channel_id} not found.`);
                            continue;
                        }
                        } catch (e) {
                            // console.error(`Error fetching channel ${ch.channel_id}:`, e);
                            continue;
                        }
                    }

                    if (!channel || !channel.isTextBased() && !channel.isVoiceBased()) {
                        // console.log(`Channel ${ch.channel_id} not valid or not a supported type`);
                        continue;
                    }

                    try {
                        const newName = new UpdateData(client, guild, ch.channel_name).getResult();
                        // console.log(`Updating channel ${ch.channel_id} to name: ${newName}`);
                        await channel.setName(newName);
                    } catch (e) {
                        // console.error(`Failed to update channel ${ch.channel_id}:`, e);
                    }
                }
            }
            catch(e){}
        }); 
    }
}