import { ApplicationCommandOptionType, CommandInteraction, Interaction, SlashCommandStringOption } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";


export default class Ping extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "ping",
            description: {
                content: "Ping Pong!",
                examples: ["ping"],
                usage: "ping",
            },
            category: "Info",
            cooldown: 3,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            options: [],
        });
    }
    async callback(client: BotClient, interaction: CommandInteraction): Promise<any> {
        return await interaction.reply({
            content: "Pong!"
        }).catch(() => {});
    }
};
