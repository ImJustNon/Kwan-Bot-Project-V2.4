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
const discord_js_1 = require("discord.js");
const MusicChannelMessage_util_1 = __importDefault(require("./MusicChannelMessage.util"));
const MusicChannelDefaultMessage_util_1 = __importDefault(require("./MusicChannelDefaultMessage.util"));
class MusicChannelWebhook {
    constructor(webhookId, webhookToken) {
        this.webhookId = webhookId;
        this.webhookToken = webhookToken;
        this.webhookClient = new discord_js_1.WebhookClient({
            id: webhookId,
            token: webhookToken
        });
    }
    editEmbedTrack(client, player, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webhookClient.editMessage(messageId, {
                embeds: [
                    new MusicChannelMessage_util_1.default(client, player).createTrackEmbedMessage(),
                ]
            });
        });
    }
    editEmbedDefault(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webhookClient.editMessage(messageId, {
                embeds: [
                    new MusicChannelDefaultMessage_util_1.default().defaultTrackEmbedMessage(),
                ]
            });
        });
    }
    editQueueTrack(client, player, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webhookClient.editMessage(messageId, {
                content: new MusicChannelMessage_util_1.default(client, player).createQueueMessage(),
            });
        });
    }
    editQueueDefault(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webhookClient.editMessage(messageId, {
                content: new MusicChannelDefaultMessage_util_1.default().defaultQueueMessage(),
            });
        });
    }
    sendThenDelete(options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webhookClient.send(options).then((msg) => {
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield this.webhookClient.deleteMessage(msg.id);
                }), 5000);
            }).catch(() => { });
        });
    }
    send(options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webhookClient.send(options).catch(() => { });
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.webhookClient.delete();
        });
    }
}
exports.default = MusicChannelWebhook;
//# sourceMappingURL=MusicChannelWebhook.util.js.map