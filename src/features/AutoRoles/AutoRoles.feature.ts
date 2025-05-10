import { BotClient } from "../../classes/Client.class";
import { Feature } from "../../classes/Feature.class";
import GuildMemberAdd from "./events/GuildMemberAdd.event";

export default class AutoVoiceChannel extends Feature {
    constructor(client: BotClient, file: string){
        super(client, file, {
            name: "AutoRoles"
        });
    }

    async callback(client: BotClient) {
        new GuildMemberAdd(client);
    }
}