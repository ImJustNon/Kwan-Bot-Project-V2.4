import { INode, INodeStats, Manager } from "moonlink.js";
import { BotClient } from "./Client.class";
import { config } from "../config/config";

export class MoonlinkClient extends Manager {

    constructor(client: BotClient){
        super({
            nodes: config.nodes,
            sendPayload: (guildId: string, payload: any) => {
                const guild = client.guilds.cache.get(guildId);
                if (guild) guild.shard.send(JSON.parse(payload));
            },
            options: {
                NodeLinkFeatures: true,
                previousInArray: true,
                logFile: {
                    log: true,
                    path: "moonlink.log",
                },
                partialTrack: ["url", "duration", "artworkUrl", "sourceName", "identifier"],
            },
        });

        client.on("ready", () => {
            this.init(client.user!.id);
        });

        client.on("raw", (packet: any) => {
            client.manager.packetUpdate(packet);
        });
    }
}