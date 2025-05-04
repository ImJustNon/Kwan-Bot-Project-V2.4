import { INode, INodeStats } from "moonlink.js";
import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";
export default class NodeReady extends Event {
    constructor(client: BotClient, file: string);
    callback(node: INode, stats: INodeStats): Promise<void>;
}
