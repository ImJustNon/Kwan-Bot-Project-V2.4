import { WebhookMessageCreateOptions } from "discord.js";
import { BotClient } from "../classes/Client.class";
import { Player } from "moonlink.js";
export default class MusicChannelWebhook {
    private webhookId;
    private webhookToken;
    private webhookClient;
    constructor(webhookId: string, webhookToken: string);
    editEmbedTrack(client: BotClient, player: Player, messageId: string): Promise<void>;
    editEmbedDefault(messageId: string): Promise<void>;
    editQueueTrack(client: BotClient, player: Player, messageId: string): Promise<void>;
    editQueueDefault(messageId: string): Promise<void>;
    sendThenDelete(options: WebhookMessageCreateOptions): Promise<void>;
    send(options: WebhookMessageCreateOptions): Promise<void>;
    delete(): Promise<void>;
}
