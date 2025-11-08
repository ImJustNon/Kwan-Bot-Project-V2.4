import { ClientEvents } from "discord.js";
import { BotClient } from "../../../classes/Client.class";

export abstract class Event {
    constructor(client: BotClient, event: keyof ClientEvents) {
        client.on(event, (...args) => this.callback(...args));
    }

    abstract callback(...args: any[]): Promise<void>;
}