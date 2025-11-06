import { ChannelType, PermissionsBitField, VoiceChannel, VoiceState } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { GuildAutoVoiceChannel } from "../../../models/GuildAutoVoiceChannel.model";
import { CacheAutoVoiceChannel } from "../../../models/CacheAutoVoiceChannel.model";

export default class VoiceStateUpdate {
    constructor(client: BotClient){
        client.on("voiceStateUpdate", async(oldState: VoiceState, newState: VoiceState) =>{
            // Join Channel
            if(newState.channel && !oldState.channel){
                // const findAutoVCConfig = await client.prisma.guildAutoVoiceChannel.findUnique({
                //     where: {
                //         guild_id: newState.guild.id,
                //         channel_id: newState.channel.id
                //     }
                // });
                const findAutoVCConfig = await GuildAutoVoiceChannel.findOne({
                    guild_id: newState.guild.id,
                    channel_id: newState.channel.id
                });
                if(!findAutoVCConfig) return;
                await this.createVoiceChannel(client, newState);
                return;
            }
            // Left Channel
            if(oldState.channel && !newState.channel){
                // const findAutoVCCache = await client.prisma.cacheAutoVoiceChannel.findUnique({
                //     where: {
                //         guild_id: oldState.guild.id,
                //         channel_id: oldState.channel.id
                //     }
                // });
                const findAutoVCCache = await CacheAutoVoiceChannel.findOne({
                    guild_id: oldState.guild.id,
                    channel_id: oldState.channel.id
                });
                if(!findAutoVCCache) return;
                const voiceChannel = oldState.guild.channels.cache.get(findAutoVCCache.channel_id);
                if(!voiceChannel) return;
                if((voiceChannel as VoiceChannel).members.size >= 1) return;
                // await client.prisma.cacheAutoVoiceChannel.delete({
                //     where: {
                //         guild_id: oldState.guild.id,
                //         channel_id: oldState.channel.id
                //     }
                // });
                await CacheAutoVoiceChannel.deleteOne({
                    guild_id: oldState.guild.id,
                    channel_id: oldState.channel.id
                });
                await voiceChannel.delete().catch(e => {});
                return;
            }
            // Switch Channel
            if(oldState.channel && newState.channel){
                if(oldState.channel.id === newState.channel.id) return;
                // const findAutoVCConfig = await client.prisma.guildAutoVoiceChannel.findUnique({
                //     where: {
                //         guild_id: newState.guild.id,
                //         channel_id: newState.channel.id
                //     }
                // });
                const findAutoVCConfig = await GuildAutoVoiceChannel.findOne({
                    guild_id: newState.guild.id,
                    channel_id: newState.channel.id
                });
                if(findAutoVCConfig){
                    await this.createVoiceChannel(client, newState);
                }
                // const findAutoVCCache = await client.prisma.cacheAutoVoiceChannel.findUnique({
                //     where: {
                //         guild_id: oldState.guild.id,
                //         channel_id: oldState.channel.id
                //     }
                // });
                const findAutoVCCache = await CacheAutoVoiceChannel.findOne({
                    guild_id: oldState.guild.id,
                    channel_id: oldState.channel.id
                });
                if(!findAutoVCCache) return;
                const voiceChannel = oldState.guild.channels.cache.get(findAutoVCCache.channel_id);
                if(!voiceChannel) return;
                if((voiceChannel as VoiceChannel).members.size >= 1) return;
                // await client.prisma.cacheAutoVoiceChannel.delete({
                //     where: {
                //         guild_id: oldState.guild.id,
                //         channel_id: oldState.channel.id
                //     }
                // });
                await CacheAutoVoiceChannel.deleteOne({
                    guild_id: oldState.guild.id,
                    channel_id: oldState.channel.id
                })
                await voiceChannel.delete().catch(e => {});
                return;
            }
        });
    }

    async createVoiceChannel(client: BotClient, state: VoiceState){
        const channelParent: string | null = state.channel?.parent ? state.channel.parent.id : null;
        if(!state.member || !state.channel) return;
        await state.guild.channels.create({
            name: `${state.member?.user.username}'s Room`,
            type: ChannelType.GuildVoice,
            parent: channelParent,
        }).then(async newVoiceChannel =>{
            await state.member?.voice.setChannel(newVoiceChannel);
            // await client.prisma.cacheAutoVoiceChannel.create({
            //     data: {
            //         guild_id: state.guild.id,
            //         channel_id: state.channel!.id,
            //         parent_id: channelParent !== null ? channelParent : "0",
            //         creator_user_id: state.member!.id,
            //     }
            // });
            await CacheAutoVoiceChannel.create({
                guild_id: state.guild.id,
                channel_id: state.channel!.id,
                parent_id: channelParent !== null ? channelParent : "0",
                author_id: state.member!.id,
            });
            await newVoiceChannel.permissionOverwrites.set([
                {
                    id: state.member!.id,
                    allow: [PermissionsBitField.Flags.ManageChannels],
                },
                {
                    id: state.guild.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
            ]);
        });
    }
}