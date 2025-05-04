import { Player } from "moonlink.js";
import { BotClient } from "../classes/Client.class";
import { EmbedBuilder } from "discord.js";
export default class MusicChannelMessage {
    client: BotClient;
    player: Player;
    constructor(client: BotClient, player: Player);
    createQueueMessage(): string;
    createTrackEmbedMessage(): EmbedBuilder;
}
