import { CommandInteraction, Message, TextChannel, Webhook, WebhookType } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
export default class MusicChannelSetup extends Command {
    constructor(client: BotClient);
    callback(client: BotClient, interaction: CommandInteraction): Promise<any>;
    setupChannel(client: BotClient, interaction: CommandInteraction): Promise<void>;
    setupWebhook(client: BotClient, interaction: CommandInteraction, ch: TextChannel): Promise<Message<boolean> | undefined>;
    setupDefaultMessage(client: BotClient, interaction: CommandInteraction, ch: TextChannel, webhook: Webhook<WebhookType.Incoming>): Promise<void>;
}
