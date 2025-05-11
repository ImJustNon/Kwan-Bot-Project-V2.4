import { BotClient } from "../../classes/Client.class";
import { Feature } from "../../classes/Feature.class";
import GuildCreate from "./events/GuildCreate.event";

export default class GreetingMessage extends Feature {
    constructor(client: BotClient, file: string){
        super(client, file, {
            name: "GreetingMessage"
        });
    }

    async callback(client: BotClient): Promise<void> {
        new GuildCreate(client);
    }
}