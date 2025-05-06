import { Collection, CommandInteraction, GuildMember, Interaction, InteractionType, PermissionFlagsBits } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";
import { Command } from "../../classes/Command.class";
import { SearchResult } from "moonlink.js";

export default class InteractionCreate extends Event {
    constructor(client: BotClient, file: string) {
        super(client, file, {
            name: "interactionCreate",
            type: "client"
        });
    }

    async callback(interaction: Interaction): Promise<any> {
        if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
            if (interaction.commandName == "play") {
                const search = interaction.options.getString("search") as string;
                const res: SearchResult = await this.client.manager.search({
                    query: search,
                });
                let songs: {name: string; value: string}[] = [];
                switch (res.loadType) {
                    case "search":
                        if (!res.tracks.length) return;
                        res.tracks.slice(0, 10).forEach((x) => {
                            songs.push({
                                name: x.title,
                                value: x.url ?? "",
                            });
                        });
                        break;
                    default:
                        break;
                }
                return await interaction.respond(songs).catch(() => { });
            }
        }
    }
}