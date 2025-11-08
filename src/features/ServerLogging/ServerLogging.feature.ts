import { BotClient } from "../../classes/Client.class";
import { Feature } from "../../classes/Feature.class";
import { MessageCreate } from "./events/messageCreate.event";

export default class ServerLogging extends Feature {
    constructor(client: BotClient, file: string){
        super(client, file, {
            name: "ServerLogging"
        });
    }

    async callback(): Promise<void> {
        new MessageCreate(this.client)
    }
}