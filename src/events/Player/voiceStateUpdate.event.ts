import { ActivityType, Collection, GuildBasedChannel, GuildMember, PresenceUpdateStatus, VoiceState } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";
import { config } from "../../config/config";
import { Player } from "moonlink.js";


export default class VoiceStateUpdate extends Event {
    constructor(client: BotClient, file: string) {
        super(client, file, {
            name: "voiceStateUpdate",
            type: "client"
        });
    }

    async callback(oldState: VoiceState, newState: VoiceState) {
        this.checkDisconnect(oldState, newState);
        this.checkEmptyChannel(oldState, newState);
    }

    async checkDisconnect(oldState: VoiceState, newState: VoiceState){
        const player: Player | undefined = this.client.manager.players.get(newState.guild.id);

        if(player){
            if (oldState.channelId === null || typeof oldState.channelId == 'undefined') return;
            if (newState.id !== this.client.user?.id) return;

            player.destroy();
        }   
    }

    async checkEmptyChannel(oldMember: VoiceState, newMember: VoiceState){
        const player: Player | undefined = this.client.manager.players.get(newMember.guild.id);

        if(player){
            const voiceChannel: GuildBasedChannel | undefined = newMember.guild.channels.cache.get(player.voiceChannelId);
            const textChannel: GuildBasedChannel | undefined = newMember.guild.channels.cache.get(player.textChannelId);
            const members = voiceChannel?.members as Collection<string, GuildMember>;

            if(player.playing && members.size <= 1){
                await player.destroy();
                // if(!player.paused){
                //     player.pause(true);
                //     textChannel.send({
                //         embeds: [new EmbedBuilder().setColor("Random").setTitle(`⏸️ | กำลังหยุดชั่วคราว`)],
                //     });
                // }
            }
            // else {
            //     if(player.paused){
            //         player.pause(false);
            //         textChannel.send({
            //             embeds: [new EmbedBuilder().setColor("Random").setTitle(`⏯️ | กำลังเล่นต่อจากเดิม`)],
            //         });
            //     }
            // }
        } 
    }

};
