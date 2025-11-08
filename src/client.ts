import { GatewayIntentBits, Partials } from "discord.js";
import { BotClient } from "./classes/Client.class";
import { config } from "./config/config";
import fs from "fs";
import path from "path";


const client: BotClient = new BotClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent
    ], 
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction
    ],
    allowedMentions: {
        parse: ["users", "roles"],
        repliedUser: false
    }
});





if(fs.existsSync(path.join(__dirname, "./utils/Logo.txt"))){
    try {
        const logFileData = fs.readFileSync(path.join(__dirname, "./utils/Logo.txt"), {
            encoding: "utf-8"
        });
        console.log('\x1b[35m%s\x1b[0m', logFileData);
    } catch (e) {}
}



client.setMaxListeners(0);
client.startLogin(config.bot.token);