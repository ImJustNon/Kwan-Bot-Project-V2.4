import { ClientEvents } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { GuildLoggingChannel } from "../../../models/GuildLoggingChannel.model";

export class Event {
    protected event: keyof ClientEvents;
    protected client: BotClient;
    constructor(client: BotClient, event: keyof ClientEvents) {
        this.event = event;
        this.client = client;
        client.on(event, (...args) => this.callback(...args));
    }

    async callback(...args: any[]): Promise<void>{
        return await Promise.resolve();
    }
}