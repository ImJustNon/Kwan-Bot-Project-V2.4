import { BotClient } from "../../classes/Client.class";
import { Feature } from "../../classes/Feature.class";
import ChannelCreate from "./events/ChannelCreate.event";
import ChannelDelete from "./events/ChannelDelete.event";
import GuildMemberAdd from "./events/GuildMemberAdd.event";
import GuildMemberRemove from "./events/GuildMemberRemove.event";
import PresenceUpdate from "./events/PresenceUpdate.event";

export default class ServerStats extends Feature {
    constructor(client: BotClient, file: string){
        super(client, file, {
            name: "ServerStats"
        });
    }

    async callback() {
        new GuildMemberAdd(this.client);
        new GuildMemberRemove(this.client);
        new PresenceUpdate(this.client);
        new ChannelCreate(this.client);
        new ChannelDelete(this.client);
    }
}