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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_class_1 = require("../../classes/Event.class");
const MusicChannelWebhook_util_1 = __importDefault(require("../../utils/MusicChannelWebhook.util"));
class PlayerDestroy extends Event_class_1.Event {
    constructor(client, file) {
        super(client, file, {
            name: "playerDestroyed",
            type: "player"
        });
    }
    callback(player) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const textChannel = this.client.channels.cache.get(player.textChannelId);
            if (!textChannel.name.includes("music") && !textChannel.name.includes(`${(_a = this.client.user) === null || _a === void 0 ? void 0 : _a.username}-music`) && !textChannel.name.includes(`${(_b = this.client.user) === null || _b === void 0 ? void 0 : _b.username}`))
                return;
            try {
                const findMusicChannel = yield this.client.prisma.guildMusicChannel.findUnique({
                    where: {
                        guild_id: player.guildId,
                        channel_id: player.textChannelId
                    },
                    select: {
                        content_banner_id: true,
                        content_queue_id: true,
                        content_playing_id: true,
                        webhook_id: true,
                        webhook_token: true,
                    }
                });
                if (!findMusicChannel)
                    return;
                const webhook = new MusicChannelWebhook_util_1.default(findMusicChannel.webhook_id, findMusicChannel.webhook_token);
                yield webhook.editQueueDefault(findMusicChannel.content_queue_id);
                yield webhook.editEmbedDefault(findMusicChannel.content_playing_id);
            }
            catch (e) {
                console.log(`[Error] `, e);
            }
        });
    }
}
exports.default = PlayerDestroy;
//# sourceMappingURL=playerDestroy.event.js.map