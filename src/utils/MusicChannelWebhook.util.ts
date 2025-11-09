import { MessagePayload, WebhookClient, WebhookMessageCreateOptions } from "discord.js";
import { BotClient } from "../classes/Client.class";
import { Player } from "moonlink.js";
import MusicChannelMessage from "./MusicChannelMessage.util";
import MusicChannelDefaultMessage from "./MusicChannelDefaultMessage.util";
import { WebhookMessage } from "./WebhookMessage.util";

export default class MusicChannelWebhook extends WebhookMessage {

    constructor(webhookId: string, webhookToken: string){
        super(webhookId, webhookToken);
    }

    public async editEmbedTrack(client: BotClient, player: Player, messageId: string){
        await this.webhookClient.editMessage(messageId, {
            embeds: [
                new MusicChannelMessage(client, player).createTrackEmbedMessage(),
            ]
        });
    }

    public async editEmbedDefault(messageId: string){
        await this.webhookClient.editMessage(messageId, {
            embeds: [
                new MusicChannelDefaultMessage().defaultTrackEmbedMessage(),
            ]
        });
    }

    public async editQueueTrack(client: BotClient, player: Player, messageId: string){
        await this.webhookClient.editMessage(messageId, {
            content: new MusicChannelMessage(client, player).createQueueMessage(),            
        });
    }

    public async editQueueDefault(messageId: string){
        await this.webhookClient.editMessage(messageId, {
            content: new MusicChannelDefaultMessage().defaultQueueMessage(),            
        });
    }
}