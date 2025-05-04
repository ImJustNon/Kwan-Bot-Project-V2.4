import { Client, Collection, Interaction, SlashCommandBuilder, StartThreadOptions } from "discord.js";

export interface BotClient extends Client {
    commands?: Collection<any, any>;
}

export interface CommandConfig {
    config: {
        builder: SlashCommandBuilder;
        permission: string;
    }
    callback: (params: string) => Promise<any>
}