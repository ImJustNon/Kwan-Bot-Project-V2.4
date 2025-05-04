import { Player } from "moonlink.js";
import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";
export default class PlayerDestroy extends Event {
    constructor(client: BotClient, file: string);
    callback(player: Player): Promise<void>;
}
