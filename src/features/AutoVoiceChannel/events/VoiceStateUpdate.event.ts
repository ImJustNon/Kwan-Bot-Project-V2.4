import { ChannelType, PermissionsBitField, VoiceChannel, VoiceState } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { GuildAutoVoiceChannel } from "../../../models/GuildAutoVoiceChannel.model";
import { CacheAutoVoiceChannel } from "../../../models/CacheAutoVoiceChannel.model";

export default class VoiceStateUpdate {
    constructor(client: BotClient) {
        client.on("voiceStateUpdate", async (oldState: VoiceState, newState: VoiceState) => {

            // 1. User joined a channel
            if (newState.channel && !oldState.channel) {
                const findAutoVCConfig = await GuildAutoVoiceChannel.findOne({
                    guild_id: newState.guild.id,
                    channel_id: newState.channel.id
                });
                if (!findAutoVCConfig) return;

                await this.createVoiceChannel(client, newState);
                return;
            }

            // 2. User left a channel
            if (oldState.channel && !newState.channel) {
                const findAutoVCCache = await CacheAutoVoiceChannel.findOne({
                    guild_id: oldState.guild.id,
                    channel_id: oldState.channel.id
                });
                if (!findAutoVCCache) return;

                const voiceChannel = oldState.guild.channels.cache.get(findAutoVCCache.channel_id);
                if (!voiceChannel) return;
                if ((voiceChannel as VoiceChannel).members.size >= 1) return;

                await CacheAutoVoiceChannel.deleteOne({
                    guild_id: oldState.guild.id,
                    channel_id: oldState.channel.id
                });

                await voiceChannel.delete().catch(() => {});
                return;
            }

            // 3. User switched channels
            if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
                // Join to auto VC channel
                const findAutoVCConfig = await GuildAutoVoiceChannel.findOne({
                    guild_id: newState.guild.id,
                    channel_id: newState.channel.id
                });

                if (findAutoVCConfig) {
                    await this.createVoiceChannel(client, newState);
                }

                // Leave from cached room
                const findAutoVCCache = await CacheAutoVoiceChannel.findOne({
                    guild_id: oldState.guild.id,
                    channel_id: oldState.channel.id
                });

                if (!findAutoVCCache) return;

                const voiceChannel = oldState.guild.channels.cache.get(findAutoVCCache.channel_id);
                if (!voiceChannel) return;
                if ((voiceChannel as VoiceChannel).members.size >= 1) return;

                await CacheAutoVoiceChannel.deleteOne({
                    guild_id: oldState.guild.id,
                    channel_id: oldState.channel.id
                });

                await voiceChannel.delete().catch(() => {});
                return;
            }
        });
    }

    async createVoiceChannel(client: BotClient, state: VoiceState) {
        if (!state.member || !state.channel) return;

        // Prevent double creation (if user already has a room)
        const existingRoom = await CacheAutoVoiceChannel.findOne({
            guild_id: state.guild.id,
            author_id: state.member.id,
        });

        if (existingRoom) {
            const existingVC = state.guild.channels.cache.get(existingRoom.channel_id);
            if (existingVC && existingVC.isVoiceBased()) {
                await state.member.voice.setChannel(existingVC);
                return;
            } else {
                await CacheAutoVoiceChannel.deleteOne({ _id: existingRoom._id });
            }
        }

        // Small delay to prevent race conditions
        await new Promise(res => setTimeout(res, 300));

        // Safety check again (in case user moved already)
        if (!state.channel) return;

        const channelParent = state.channel.parent ? state.channel.parent.id : null;

        const newVoiceChannel = await state.guild.channels.create({
            name: `${state.member.user.username}'s Room`,
            type: ChannelType.GuildVoice,
            parent: channelParent,
        });

        // Move member to the new channel
        if (state.member.voice.channelId === state.channel.id) {
            await state.member.voice.setChannel(newVoiceChannel).catch(() => {});
        }

        // Save new room info
        await CacheAutoVoiceChannel.create({
            guild_id: state.guild.id,
            channel_id: newVoiceChannel.id,
            parent_id: channelParent ?? "0",
            author_id: state.member.id,
        });

        // Set permissions
        await newVoiceChannel.permissionOverwrites.set([
            {
                id: state.member.id,
                allow: [PermissionsBitField.Flags.ManageChannels],
            },
            {
                id: state.guild.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
        ]);
    }
}
