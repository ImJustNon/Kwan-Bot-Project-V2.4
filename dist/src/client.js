"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Client_class_1 = require("./classes/Client.class");
const config_1 = require("./config/config");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const client = new Client_class_1.BotClient({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildBans,
        discord_js_1.GatewayIntentBits.GuildEmojisAndStickers,
        discord_js_1.GatewayIntentBits.GuildIntegrations,
        discord_js_1.GatewayIntentBits.GuildWebhooks,
        discord_js_1.GatewayIntentBits.GuildInvites,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
        discord_js_1.GatewayIntentBits.GuildPresences,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildMessageReactions,
        discord_js_1.GatewayIntentBits.GuildMessageTyping,
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.DirectMessageReactions,
        discord_js_1.GatewayIntentBits.DirectMessageTyping,
        discord_js_1.GatewayIntentBits.MessageContent
    ],
    partials: [
        discord_js_1.Partials.Channel,
        discord_js_1.Partials.Message,
        discord_js_1.Partials.User,
        discord_js_1.Partials.GuildMember,
        discord_js_1.Partials.Reaction
    ],
    allowedMentions: {
        parse: ["users", "roles"],
        repliedUser: false
    }
});
if (fs_1.default.existsSync(path_1.default.join(__dirname, "./utils/Logo.txt"))) {
    try {
        const logFileData = fs_1.default.readFileSync(path_1.default.join(__dirname, "./utils/Logo.txt"), {
            encoding: "utf-8"
        });
        console.log('\x1b[35m%s\x1b[0m', logFileData);
    }
    catch (e) { }
}
client.setMaxListeners(0);
client.startLogin(config_1.config.bot.token);
//# sourceMappingURL=client.js.map