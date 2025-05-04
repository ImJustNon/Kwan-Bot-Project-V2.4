import { BotClient } from "./Client.class";
export declare abstract class Feature {
    client: BotClient;
    file: string;
    name: string;
    fileName: string;
    constructor(client: BotClient, file: string, options: {
        name: string;
    });
    callback(..._args: any): Promise<void>;
}
