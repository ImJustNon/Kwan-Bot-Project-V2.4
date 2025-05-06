import { Player } from "moonlink.js";
import { BotClient } from "../classes/Client.class"
import ConvertTime from "./ConvertTime.util";
import { config } from "../config/config";
import { EmbedBuilder } from "discord.js";

export default class MusicChannelMessage {
    client: BotClient;
    player: Player;

    constructor(client: BotClient, player: Player){
        this.client = client;
        this.player = player;
    }

    createQueueMessage(){
        let defaultQueueMessage: string = `**คิวเพลง: [${this.player.queue.size}]**\n`;
        let finalQueueMessage: string = "";

        for(let i: number = 0; i < this.player.queue.size; i++) {
            defaultQueueMessage += `> \`${i + 1})\` [${new ConvertTime().convertTime(this.player.queue.tracks[i].duration)}] - ${this.player.queue.tracks[i].title}\n`;
            if(defaultQueueMessage.length >= 2000){
                break;
            }
            finalQueueMessage = defaultQueueMessage;
        }

        if(finalQueueMessage.length === 0){
            return finalQueueMessage = defaultQueueMessage + "ยังไม่รายการคิว";
        }
        else{
            return finalQueueMessage;
        }
    }

    createTrackEmbedMessage(){
        let loopType: string = 'ปิด';
        if(this.player.loop === "track") loopType = 'เพลงเดียว';
        else if(this.player.loop === "queue") loopType = 'ทั้งหมด'; 
        
        const trackRequester = JSON.parse(JSON.stringify(this.player.current.requestedBy))?.id;
    
        const embed = new EmbedBuilder()
            .setColor(config.assets.musicChannel.defaultColor)
            .setTitle(`${this.player.current.title}`)
            .setURL(`${this.player.current.url}`)
            .addFields([
                {
                    name: "📫 | เปิดโดย",
                    value: `<@${trackRequester}>`,
                    inline: true,
                },
                {
                    name: "🔄 | Loop",
                    value: `\` ${loopType} \``,
                    inline: true,
                },
                {
                    name: "🔊 | Volume",
                    value: `\` ${this.player.volume === 0 ? "ปิดเสียง" : this.player.volume} \``,
                    inline: true,
                },
                {
                    name: "🚪 | ช่อง",
                    value: `<#${this.player.textChannelId}>`,
                    inline: true,
                },
                {
                    name: "🌍 | Creator",
                    value: `\` ${this.player.current.author} \``,
                    inline: true,
                },
                {
                    name: "⏳ | เวลา",
                    value: `\` ${new ConvertTime().convertTime(this.player.current.duration ?? 0)} \``,
                    inline: true,
                },
            ])
            .setImage(`${this.player.current.artworkUrl}`)
            .setFooter({ 
                text: `${this.client.user?.username}`
            })
            .setTimestamp();
        return embed;
    }
}