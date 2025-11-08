import { BotClient } from "../../classes/Client.class";
import { Feature } from "../../classes/Feature.class";
import GuildMemberAdd from "./events/guildMemberAdd.event";

export default class GreetingMessage extends Feature {
    constructor(client: BotClient, file: string){
        super(client, file, {
            name: "GreetingMessage"
        });
    }

    async callback(): Promise<void> {
        new GuildMemberAdd(this.client);
    }
}