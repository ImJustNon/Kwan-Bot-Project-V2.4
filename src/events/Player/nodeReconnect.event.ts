import { INode } from "moonlink.js";
import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";

export default class NodeReconnect extends Event {
    constructor(client: BotClient, file: string) {
        super(client, file, {
            name: "nodeReconnect",
            type: "player"
        });
    }

    async callback(node: INode) {
        this.client.logger.warn(`Node ${node.identifier} reconnected`);
    }
}