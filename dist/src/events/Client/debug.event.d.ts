import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";
export default class Debug extends Event {
    constructor(client: BotClient, file: string);
    callback(message: string): Promise<void>;
}
