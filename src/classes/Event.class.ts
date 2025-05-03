import { ClientEvents, ClientOptions } from "discord.js";
import { BotClient } from "./Client.class";
import { IEvents } from "moonlink.js";

export abstract class Event {
    client: BotClient;
    file: string;
    name: keyof ClientEvents | keyof IEvents;
    one: any;
    fileName: string;


    constructor(client: BotClient, file: string, options: {name: keyof ClientEvents | keyof IEvents; one?: any}) {
        this.client = client;
        this.file = file;
        this.name = options.name;
        this.one = options.one || false;
        this.fileName = file.split('.')[0];

    }

    async callback(..._args: any) {
        return await Promise.resolve();
    }
}
