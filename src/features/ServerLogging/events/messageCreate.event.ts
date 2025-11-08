import { Message, User } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { Event } from "../classes/Event.class";

export class MessageCreate extends Event {
    constructor(client: BotClient) {
        super(client, "messageCreate");
    }

    async callback(message: Message): Promise<void> {
        if (message.author.bot) return;
        
        if (message.content === "!ping") {
            await message.reply("Pong!");
        }
    }
}