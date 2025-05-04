"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoonlinkClient = void 0;
const moonlink_js_1 = require("moonlink.js");
const config_1 = require("../config/config");
class MoonlinkClient extends moonlink_js_1.Manager {
    constructor(client) {
        super({
            nodes: config_1.config.nodes,
            sendPayload: (guildId, payload) => {
                const guild = client.guilds.cache.get(guildId);
                if (guild)
                    guild.shard.send(JSON.parse(payload));
            },
            options: {
                clientName: "Kwan's 2",
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
            this.init(client.user.id);
        });
        client.on("raw", (packet) => {
            client.manager.packetUpdate(packet);
        });
    }
}
exports.MoonlinkClient = MoonlinkClient;
//# sourceMappingURL=MoonLink.class.js.map