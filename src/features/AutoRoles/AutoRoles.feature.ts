import { BotClient } from "../../classes/Client.class";
import { Feature } from "../../classes/Feature.class";
import GuildMemberAdd from "./events/GuildMemberAdd.event";

export default class AutoRoles extends Feature {
    constructor(client: BotClient, file: string){
        super(client, file, {
            name: "AutoRoles"
        });
    }

    async callback() {
        new GuildMemberAdd(this.client);
    }
}