import { EmbedBuilder, VoiceState } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { Event } from "../classes/Event.class";
import { GuildLoggingChannel } from "../../../models/GuildLoggingChannel.model";
import { WebhookMessage } from "../../../utils/WebhookMessage.util";

export class VoiceStateUpdate extends Event {
    constructor(client: BotClient) {
        super(client, "voiceStateUpdate");
    }

    async callback(oldState: VoiceState, newState: VoiceState): Promise<void> {
        if (!newState.guild) return;

        const findLoggingSetup = await GuildLoggingChannel.findOne({
            guild_id: newState.guild.id
        });
        if(!findLoggingSetup) return;
        if(!findLoggingSetup.events.includes(this.event)) return;

        const member = newState.member;
        if (!member) return;

        let title = "";
        let description = "";
        let color: any = "Blue";

        // Member joined a voice channel
        if (!oldState.channel && newState.channel) {
            title = "🔊 Joined Voice Channel";
            description = `${member} joined ${newState.channel}`;
            color = "Green";
        }
        // Member left a voice channel
        else if (oldState.channel && !newState.channel) {
            title = "🔇 Left Voice Channel";
            description = `${member} left ${oldState.channel}`;
            color = "Red";
        }
        // Member switched voice channels
        else if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
            title = "🔄 Switched Voice Channel";
            description = `${member} switched from ${oldState.channel} to ${newState.channel}`;
            color = "Blue";
        }
        // Member muted/unmuted
        else if (oldState.mute !== newState.mute) {
            title = newState.mute ? "🔇 Server Muted" : "🔊 Server Unmuted";
            description = `${member} was ${newState.mute ? "muted" : "unmuted"} in ${newState.channel}`;
            color = "Yellow";
        }
        // Member deafened/undeafened
        else if (oldState.deaf !== newState.deaf) {
            title = newState.deaf ? "🔇 Server Deafened" : "🔊 Server Undeafened";
            description = `${member} was ${newState.deaf ? "deafened" : "undeafened"} in ${newState.channel}`;
            color = "Yellow";
        }
        // Member self muted/unmuted
        else if (oldState.selfMute !== newState.selfMute) {
            title = newState.selfMute ? "🔇 Self Muted" : "🔊 Self Unmuted";
            description = `${member} ${newState.selfMute ? "muted" : "unmuted"} themselves in ${newState.channel}`;
            color = "Grey";
        }
        // Member self deafened/undeafened
        else if (oldState.selfDeaf !== newState.selfDeaf) {
            title = newState.selfDeaf ? "🔇 Self Deafened" : "🔊 Self Undeafened";
            description = `${member} ${newState.selfDeaf ? "deafened" : "undeafened"} themselves in ${newState.channel}`;
            color = "Grey";
        }
        // Streaming started/stopped
        else if (oldState.streaming !== newState.streaming) {
            title = newState.streaming ? "📹 Started Streaming" : "📹 Stopped Streaming";
            description = `${member} ${newState.streaming ? "started" : "stopped"} streaming in ${newState.channel}`;
            color = "Purple";
        }
        // Video started/stopped
        else if (oldState.selfVideo !== newState.selfVideo) {
            title = newState.selfVideo ? "📹 Started Video" : "📹 Stopped Video";
            description = `${member} ${newState.selfVideo ? "started" : "stopped"} their video in ${newState.channel}`;
            color = "Purple";
        }
        else {
            return; // No significant change
        }

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${member.user.tag}`,
                iconURL: member.user.displayAvatarURL(),
            })
            .setTitle(title)
            .setDescription(description)
            .addFields(
                { name: "Member", value: `${member}`, inline: true },
                { name: "Member ID", value: member.id, inline: true }
            )
            .setColor(color)
            .setFooter({ text: "Kwan's 💕 2" })
            .setTimestamp();

        await new WebhookMessage(findLoggingSetup.webhook_id, findLoggingSetup.webhook_token).send({ embeds: [embed] });
    }
}
