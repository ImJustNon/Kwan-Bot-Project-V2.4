import { ApplicationCommandOption, ApplicationCommandSubCommand, CommandInteraction, Interaction, PermissionResolvable, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";
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
}

export abstract class Command {
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


    constructor(client: BotClient, options: CommandOptions) {
        this.client = client;
        this.name = options.name;
        this.description = {
            content: options.description ? options.description.content || "No description provided" : "No description provided",
            usage: options.description ? options.description.usage || "No usage provided" : "No usage provided",
            examples: options.description ? options.description.examples || [""] : [""],
        }
        this.cooldown = options.cooldown || 3;
        this.permissions = {
            dev: options.permissions ? options.permissions.dev || false : false,
            client: options.permissions ? options.permissions.client || [] : ["SendMessages", "ViewChannel", "EmbedLinks"],
            user: options.permissions ? options.permissions.user || [] : [],
        };
        this.options = options.options || [];
        this.category = options.category || "general";
    }

    async callback(_client: BotClient, _interaction: CommandInteraction) {
        return await Promise.resolve();
    }
}

