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
const Command_class_1 = require("../../classes/Command.class");
class Ping extends Command_class_1.Command {
    constructor(client) {
        super(client, {
            name: "ping",
            description: {
                content: "Ping Pong!",
                examples: ["ping"],
                usage: "ping",
            },
            category: "Info",
            cooldown: 3,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            options: [],
        });
    }
    callback(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield interaction.reply({
                content: "Pong!"
            }).catch(() => { });
        });
    }
}
exports.default = Ping;
;
//# sourceMappingURL=Ping.command.js.map