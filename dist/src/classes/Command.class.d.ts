import { ApplicationCommandOption, CommandInteraction, PermissionResolvable } from "discord.js";
import { BotClient } from "./Client.class";
type CommandOptions = {
    name: string;
    description?: {
        content: string;
        examples: string[];
        usage: string;
    };
    cooldown: number;
    permissions: {
        dev: boolean;
        client: PermissionResolvable[];
        user: PermissionResolvable[];
    };
    options: ApplicationCommandOption[];
    category: string;
};
export declare abstract class Command {
    client: BotClient;
    name: string;
    description?: {
        content: string;
        examples: string[];
        usage: string;
    };
    cooldown: number;
    permissions: {
        dev: boolean;
        client: PermissionResolvable[];
        user: PermissionResolvable[];
    };
    options: ApplicationCommandOption[];
    category: string;
    constructor(client: BotClient, options: CommandOptions);
    callback(_client: BotClient, _interaction: CommandInteraction): Promise<void>;
}
export {};
