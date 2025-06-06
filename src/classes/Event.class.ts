import { ClientEvents, ClientOptions } from "discord.js";
import { BotClient } from "./Client.class";
import { IEvents } from "moonlink.js";

type EvenType = "client" | "player";

export abstract class Event {
    client: BotClient;
    file: string;
    name: keyof ClientEvents | keyof IEvents;
    one: any;
    fileName: string;
    type: EvenType;


    constructor(client: BotClient, file: string, options: {name: keyof ClientEvents | keyof IEvents; one?: any; type: EvenType}) {
        this.client = client;
        this.file = file;
        this.name = options.name;
        this.one = options.one || false;
        this.fileName = file.split('.')[0];
        this.type = options.type
    }

    async callback(..._args: any) {
        return await Promise.resolve();
    }
}
