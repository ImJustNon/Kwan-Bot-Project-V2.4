import { INode } from "moonlink.js";
import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";
export default class NodeDisconnect extends Event {
    constructor(client: BotClient, file: string);
    callback(node: INode, code: number, reason: string): Promise<void>;
}
