import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";
export default class Ready extends Event {
    constructor(client: BotClient, file: string);
    callback(): Promise<void>;
    changePresence(): Promise<void>;
    setPresence(index: number): Promise<void>;
}
