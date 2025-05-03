import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";

export default class Debug extends Event {
    constructor(client: BotClient, file: string) {
        super(client, file, {
            name: "debug"
        });
    }

    async callback(...args: any) {
        this.client.logger.debug(args);
    }
}