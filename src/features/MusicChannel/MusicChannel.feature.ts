import { BotClient } from "../../classes/Client.class";
import { Feature } from "../../classes/Feature.class";
import InteractionCreate from "./events/interactionCreate.event";
import MessageCreate from "./events/messageCreate.event";

export default class MusicChannel extends Feature {
    constructor(client: BotClient, file: string){
        super(client, file, {
            name: "MusicChannel"
        });
    }

    async callback(client: BotClient) {
        new InteractionCreate(client);
        new MessageCreate(client)
    }
}