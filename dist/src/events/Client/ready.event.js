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
const discord_js_1 = require("discord.js");
const Event_class_1 = require("../../classes/Event.class");
const config_1 = require("../../config/config");
class Ready extends Event_class_1.Event {
    constructor(client, file) {
        super(client, file, {
            name: "ready",
            type: "client"
        });
    }
    callback() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.client.logger.success(`${(_a = this.client.user) === null || _a === void 0 ? void 0 : _a.tag} is ready!`);
            yield this.changePresence();
        });
    }
    changePresence() {
        return __awaiter(this, void 0, void 0, function* () {
            let index = 0;
            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                if (index >= config_1.config.bot.presences.length)
                    index = 0;
                yield this.setPresence(index);
                index++;
            }), 5000);
        });
    }
    setPresence(index) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                (_a = this.client.user) === null || _a === void 0 ? void 0 : _a.setPresence({
                    activities: [Object.assign(Object.assign({}, config_1.config.bot.presences[index]), { name: (config_1.config.bot.presences[index].name).replace("%guild_size%", String(this.client.guilds.cache.size)) })],
                    status: discord_js_1.PresenceUpdateStatus.Online,
                });
            }
            catch (e) {
                (_b = this.client.user) === null || _b === void 0 ? void 0 : _b.setPresence({
                    activities: [Object.assign(Object.assign({}, config_1.config.bot.presences[index]), { name: (config_1.config.bot.presences[index].name).replace("%guild_size%", String(this.client.guilds.cache.size)) })],
                    status: discord_js_1.PresenceUpdateStatus.Online,
                });
            }
        });
    }
}
exports.default = Ready;
;
//# sourceMappingURL=ready.event.js.map