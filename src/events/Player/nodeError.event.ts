import { INode } from "moonlink.js";
import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";

export default class NodeError extends Event {
    constructor(client: BotClient, file: string) {
        super(client, file, {
            name: "nodeError",
            type: "player"
        });
    }

    async callback(node: INode, error: Error) {
        this.client.logger.error(`Node ${node} Error: ${JSON.stringify(error)}`);
    }
}