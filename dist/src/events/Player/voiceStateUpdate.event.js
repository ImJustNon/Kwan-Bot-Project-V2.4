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
class VoiceStateUpdate extends Event_class_1.Event {
    constructor(client, file) {
        super(client, file, {
            name: "voiceStateUpdate",
            type: "client"
        });
    }
    callback(oldState, newState) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkDisconnect(oldState, newState);
            this.checkEmptyChannel(oldState, newState);
        });
    }
    checkDisconnect(oldState, newState) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const player = this.client.manager.players.get(newState.guild.id);
            if (player) {
                if (oldState.channelId === null || typeof oldState.channelId == 'undefined')
                    return;
                if (newState.id !== ((_a = this.client.user) === null || _a === void 0 ? void 0 : _a.id))
                    return;
                player.destroy();
            }
        });
    }
    checkEmptyChannel(oldMember, newMember) {
        return __awaiter(this, void 0, void 0, function* () {
            const player = this.client.manager.players.get(newMember.guild.id);
            if (player) {
                const voiceChannel = newMember.guild.channels.cache.get(player.voiceChannelId);
                const textChannel = newMember.guild.channels.cache.get(player.textChannelId);
                const members = voiceChannel === null || voiceChannel === void 0 ? void 0 : voiceChannel.members;
                if (player.playing && members.size <= 1) {
                    yield player.destroy();
                }
            }
        });
    }
}
exports.default = VoiceStateUpdate;
;
//# sourceMappingURL=voiceStateUpdate.event.js.map