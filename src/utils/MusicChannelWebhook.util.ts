import { MessagePayload, WebhookClient, WebhookMessageCreateOptions } from "discord.js";
import { BotClient } from "../classes/Client.class";
import { Player } from "moonlink.js";
import MusicChannelMessage from "./MusicChannelMessage.util";
import MusicChannelDefaultMessage from "./MusicChannelDefaultMessage.util";

export default class MusicChannelWebhook {
    private webhookId: string;
    private webhookToken: string;
    private webhookClient: WebhookClient;

    constructor(webhookId: string, webhookToken: string){
        this.webhookId = webhookId;
        this.webhookToken = webhookToken;
        this.webhookClient = new WebhookClient({
            id: webhookId,
            token: webhookToken
        });
    }

    async editEmbedTrack(client: BotClient, player: Player, messageId: string){
        await this.webhookClient.editMessage(messageId, {
            embeds: [
                new MusicChannelMessage(client, player).createTrackEmbedMessage(),
            ]
        });
    }

    async editEmbedDefault(messageId: string){
        await this.webhookClient.editMessage(messageId, {
            embeds: [
                new MusicChannelDefaultMessage().defaultTrackEmbedMessage(),
            ]
        });
    }

    async editQueueTrack(client: BotClient, player: Player, messageId: string){
        await this.webhookClient.editMessage(messageId, {
            content: new MusicChannelMessage(client, player).createQueueMessage(),            
        });
    }

    async editQueueDefault(messageId: string){
        await this.webhookClient.editMessage(messageId, {
            content: new MusicChannelDefaultMessage().defaultQueueMessage(),            
        });
    }

    async sendThenDelete(options: WebhookMessageCreateOptions){
        await this.webhookClient.send(options).then((msg) => {
            setTimeout(async(): Promise<void> =>{
                await this.webhookClient.deleteMessage(msg.id);
            }, 5000);
        }).catch(() => {});
    }

    async send(options: WebhookMessageCreateOptions){
        await this.webhookClient.send(options).catch(() => {});
    }

    async delete(){
        await this.webhookClient.delete();
    }
}