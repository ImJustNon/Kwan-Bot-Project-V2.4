import { Client, ClientOptions, Collection } from "discord.js";
import { Config } from "../config/config";
import { Logger } from "./Logger.class";
import { MoonlinkClient } from "./MoonLink.class";
import { PrismaClient } from "../../generated/prisma";
export declare class BotClient extends Client {
    commands: Collection<any, any>;
    aliases: Collection<any, any>;
    cooldown: Collection<any, any>;
    config: Config;
    logger: Logger;
    body: any[];
    manager: MoonlinkClient;
    prisma: PrismaClient;
    constructor(options: ClientOptions);
    startLogin(token: string): Promise<void>;
    regisCommand(): void;
}
