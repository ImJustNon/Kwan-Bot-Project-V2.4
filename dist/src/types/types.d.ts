import { Client, Collection, SlashCommandBuilder } from "discord.js";
export interface BotClient extends Client {
    commands?: Collection<any, any>;
}
export interface CommandConfig {
    config: {
        builder: SlashCommandBuilder;
        permission: ;
    };
    callback: (params: string) => Promise<any>;
}
