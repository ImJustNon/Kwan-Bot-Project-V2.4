import { ChannelType, Guild, GuildBasedChannel, VoiceBasedChannel } from "discord.js";
import { BotClient } from "../../classes/Client.class";

export default class AutoVoiceChannelStartup {
    constructor(client: BotClient){
        new Promise(async resolve =>{
            setTimeout(async() => {
                try {
                    const findAllAutoVCCache = await client.prisma.cacheAutoVoiceChannel.findMany();
                    
                    for(const vc of findAllAutoVCCache){
                        const guild: Guild | undefined = client.guilds.cache.get(vc.guild_id);
                        if(!guild) { 
                            // if guild not found then delete all guild cache data and skip
                            await client.prisma.cacheAutoVoiceChannel.deleteMany({
                                where: {
                                    guild_id: vc.guild_id
                                }
                            });
                            continue;
                        }; 

                        const voiceChannel: GuildBasedChannel | undefined = guild.channels.cache.get(vc.channel_id);
                        if(!voiceChannel){
                            await client.prisma.cacheAutoVoiceChannel.delete({
                                where: {
                                    guild_id: vc.guild_id,
                                    channel_id: vc.channel_id
                                }
                            });
                            continue;
                        }
                        
                        if(voiceChannel.type === ChannelType.GuildVoice){
                            if((voiceChannel as VoiceBasedChannel).members.size < 1){
                                await client.prisma.cacheAutoVoiceChannel.delete({
                                    where: {
                                        guild_id: vc.guild_id,
                                        channel_id: vc.channel_id
                                    }
                                });
                                await voiceChannel.delete().catch(() => {});
                            }
                        }
                    }
                }
                catch(e) {}
                resolve(2);
            }, 30 * 1000);
        });

    }

}