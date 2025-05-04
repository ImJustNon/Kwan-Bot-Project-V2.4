import { ClientEvents, ClientOptions } from "discord.js";
import { BotClient } from "./Client.class";
import { IEvents } from "moonlink.js";

export abstract class Feature {
    client: BotClient;
    file: string;
    name: string;
    fileName: string;

    constructor(client: BotClient, file: string, options: {name: string;}) {
        this.client = client;
        this.file = file;
        this.name = options.name;
        this.fileName = file.split('.')[0];
    }

    async callback(..._args: any) {
        return await Promise.resolve();
    }
}
