import { INode } from "moonlink.js";
import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";

export default class NodeDisconnect extends Event {
    constructor(client: BotClient, file: string) {
        super(client, file, {
            name: "nodeDisconnect",
            type: "player"
        });
    }

    async callback(node: INode, code: number, reason: string) {
        this.client.logger.error(`Node ${node} disconnected code : ${code}`);
    }
}