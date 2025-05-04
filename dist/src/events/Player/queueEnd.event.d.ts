import { Player, Track } from "moonlink.js";
import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";
export default class QueueEnd extends Event {
    constructor(client: BotClient, file: string);
    callback(player: Player, track: Track): Promise<void>;
}
