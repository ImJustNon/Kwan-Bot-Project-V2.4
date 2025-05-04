"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_class_1 = require("../../classes/Event.class");
const discord_js_1 = require("discord.js");
const config_1 = require("../../config/config");
class QueueEnd extends Event_class_1.Event {
    constructor(client, file) {
        super(client, file, {
            name: "queueEnd",
            type: "player"
        });
    }
    callback(player, track) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = this.client.channels.cache.get(player.textChannelId);
            try {
                const isMusicChannel = yield this.client.prisma.guildMusicChannel.findUnique({
                    where: {
                        guild_id: player.guildId,
                        channel_id: player.textChannelId
                    },
                });
                const msg = yield channel.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor(config_1.config.assets.musicChannel.defaultColor)
                            .setTitle('💤 | คิวหมดเเล้วน่ะ'),
                    ]
                });
                if (isMusicChannel) {
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        yield msg.delete();
                    }), 5000);
                }
            }
            catch (e) {
                console.log("[Error] ", e);
            }
            player.destroy();
        });
    }
}
exports.default = QueueEnd;
//# sourceMappingURL=queueEnd.event.js.map