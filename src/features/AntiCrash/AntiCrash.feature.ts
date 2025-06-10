import { BotClient } from "../../classes/Client.class";
import { Feature } from "../../classes/Feature.class";

export default class AntiCrash extends Feature {
    constructor(client: BotClient, file: string){
        super(client, file, {
            name: "AntiCrash"
        });
    }

    async callback() {
        process.on('unhandledRejection', (reason, promise) => {
            this.client.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
        });
        process.on('uncaughtException', err => {
            this.client.logger.error('Uncaught Exception thrown:', err);
        });
        process.on('SIGINT', this.handleExit);
        process.on('SIGTERM', this.handleExit);
        process.on('SIGQUIT', this.handleExit);
    }

    private async handleExit(){
        if (this.client) {
            this.client.logger.star('Disconnecting from Discord...');
            await this.client.destroy();
            this.client.logger.success('Successfully disconnected from Discord!');
        }
    }
}