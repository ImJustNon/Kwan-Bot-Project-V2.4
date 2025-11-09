import { ClientEvents } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { GuildLoggingChannel } from "../../../models/GuildLoggingChannel.model";

export class Event {
    constructor(client: BotClient, event: keyof ClientEvents) {
        client.on(event, (...args) => this.callback(...args));
    }

    async callback(...args: any[]): Promise<void>{
        return await Promise.resolve();
    }
}