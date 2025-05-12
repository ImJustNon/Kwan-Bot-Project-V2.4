import { INode, INodeStats } from "moonlink.js";
import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";

export default class NodeReady extends Event {
    constructor(client: BotClient, file: string) {
        super(client, file, {
            name: "nodeReady",
            type: "player"
        });
    }

    
    async callback(node: INode, stats: INodeStats) {
        this.client.logger.info(`Node ${node.identifier} is ready!`);
    }
}