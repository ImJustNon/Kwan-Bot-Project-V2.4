import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";
import { config } from "../../config/config";

export default class Debug extends Event {
    constructor(client: BotClient, file: string) {
        super(client, file, {
            name: "debug",
            type: "client"
        });
    }

    async callback(message: string) {
        if(config.logs.debug) this.client.logger.debug(message);
    }
}