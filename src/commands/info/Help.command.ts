import { ApplicationCommandOptionType, CommandInteraction, Interaction, SlashCommandStringOption } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";


export default class Help extends Command {
  constructor(client: BotClient) {
    super(client, {
      name: "help",
      description: {
        content: "Shows the help menu",
        examples: ["help"],
        usage: "help",
      },
      category: "info",
      cooldown: 3,
      permissions: {
        dev: false,
        client: ["SendMessages", "ViewChannel", "EmbedLinks"],
        user: [],
      },
      options: [
        {
          name: "command",
          description: "The command you want to get info on",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
      ],
    });
  }
  async callback(client: BotClient, interaction: CommandInteraction) {
    console.log("asdasd");
  }
};
