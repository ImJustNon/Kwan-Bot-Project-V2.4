import { CommandInteraction } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
export default class Ping extends Command {
    constructor(client: BotClient);
    callback(client: BotClient, interaction: CommandInteraction): Promise<any>;
}
