import { Interaction } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";
export default class InteractionCreate extends Event {
    constructor(client: BotClient, file: string);
    callback(interaction: Interaction): Promise<any>;
}
