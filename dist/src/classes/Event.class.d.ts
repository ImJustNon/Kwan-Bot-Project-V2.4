import { ClientEvents } from "discord.js";
import { BotClient } from "./Client.class";
import { IEvents } from "moonlink.js";
type EvenType = "client" | "player";
export declare abstract class Event {
    client: BotClient;
    file: string;
    name: keyof ClientEvents | keyof IEvents;
    one: any;
    fileName: string;
    type: EvenType;
    constructor(client: BotClient, file: string, options: {
        name: keyof ClientEvents | keyof IEvents;
        one?: any;
        type: EvenType;
    });
    callback(..._args: any): Promise<void>;
}
export {};
