import { INode } from "moonlink.js";
import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";
export default class NodeReconnect extends Event {
    constructor(client: BotClient, file: string);
    callback(node: INode): Promise<void>;
}
