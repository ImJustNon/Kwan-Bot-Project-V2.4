import { WebhookClient, WebhookMessageCreateOptions } from "discord.js";

export class WebhookMessage {
    protected webhookId: string;
    protected webhookToken: string;
    protected webhookClient: WebhookClient;
    
    constructor(webhookId: string, webhookToken: string){
        this.webhookId = webhookId;
        this.webhookToken = webhookToken;
        this.webhookClient = new WebhookClient({
            id: webhookId,
            token: webhookToken
        });
    }

    public async send(options: WebhookMessageCreateOptions){
        await this.webhookClient.send(options).catch(() => {});
    }

    public async delete(){
        await this.webhookClient.delete();
    }

    public async sendThenDelete(options: WebhookMessageCreateOptions){
        await this.webhookClient.send(options).then((msg) => {
            setTimeout(async(): Promise<void> =>{
                await this.webhookClient.deleteMessage(msg.id).catch(() => {});
            }, 5000);
        }).catch(() => {});
    }
}