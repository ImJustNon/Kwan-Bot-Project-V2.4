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
const Command_class_1 = require("../../classes/Command.class");
class Help extends Command_class_1.Command {
    constructor(client) {
        super(client, {
            name: "help",
            description: {
                content: "Shows the help menu",
                examples: ["help"],
                usage: "help",
            },
            category: "Info",
            cooldown: 3,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            options: [
                {
                    name: "command",
                    description: "The command you want to get info on",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: false,
                },
            ],
        });
    }
    callback(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("asdasd");
        });
    }
}
exports.default = Help;
;
//# sourceMappingURL=Help.command.js.map