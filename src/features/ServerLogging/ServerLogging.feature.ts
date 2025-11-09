import { BotClient } from "../../classes/Client.class";
import { Feature } from "../../classes/Feature.class";
import { MessageCreate } from "./events/messageCreate.event";
import { MessageDelete } from "./events/messageDelete.event";
import { MessageUpdate } from "./events/messageUpdate.event";
import { MessageBulkDelete } from "./events/messageBulkDelete.event";
import { GuildMemberAdd } from "./events/guildMemberAdd.event";
import { GuildMemberRemove } from "./events/guildMemberRemove.event";
import { GuildMemberUpdate } from "./events/guildMemberUpdate.event";
import { UserUpdate } from "./events/userUpdate.event";
import { GuildUpdate } from "./events/guildUpdate.event";
import { RoleCreate } from "./events/roleCreate.event";
import { RoleDelete } from "./events/roleDelete.event";
import { RoleUpdate } from "./events/roleUpdate.event";
import { ChannelCreate } from "./events/channelCreate.event";
import { ChannelDelete } from "./events/channelDelete.event";
import { ChannelUpdate } from "./events/channelUpdate.event";
import { VoiceStateUpdate } from "./events/voiceStateUpdate.event";
import { GuildBanAdd } from "./events/guildBanAdd.event";
import { GuildBanRemove } from "./events/guildBanRemove.event";
import { InviteCreate } from "./events/inviteCreate.event";
import { InviteDelete } from "./events/inviteDelete.event";
import { MessageReactionAdd } from "./events/messageReactionAdd.event";
import { MessageReactionRemove } from "./events/messageReactionRemove.event";
import { MessageReactionRemoveAll } from "./events/messageReactionRemoveAll.event";

export default class ServerLogging extends Feature {
    constructor(client: BotClient, file: string){
        super(client, file, {
            name: "ServerLogging"
        });
    }

    async callback(): Promise<void> {
        // Message Events
        new MessageCreate(this.client);
        new MessageDelete(this.client);
        new MessageUpdate(this.client);
        new MessageBulkDelete(this.client);
        new MessageReactionAdd(this.client);
        new MessageReactionRemove(this.client);
        new MessageReactionRemoveAll(this.client);

        // Member Events
        new GuildMemberAdd(this.client);
        new GuildMemberRemove(this.client);
        new GuildMemberUpdate(this.client);
        new UserUpdate(this.client);

        // Guild Events
        new GuildUpdate(this.client);

        // Role Events
        new RoleCreate(this.client);
        new RoleDelete(this.client);
        new RoleUpdate(this.client);

        // Channel Events
        new ChannelCreate(this.client);
        new ChannelDelete(this.client);
        new ChannelUpdate(this.client);
        new VoiceStateUpdate(this.client);

        // Ban Events
        new GuildBanAdd(this.client);
        new GuildBanRemove(this.client);

        // Invite Events
        new InviteCreate(this.client);
        new InviteDelete(this.client);
    }
}