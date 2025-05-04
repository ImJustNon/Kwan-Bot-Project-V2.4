"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("./config/config");
const path_1 = __importDefault(require("path"));
const Logger_class_1 = require("./classes/Logger.class");
const logger = new Logger_class_1.Logger();
const manager = new discord_js_1.ShardingManager(path_1.default.join(__dirname, "./client.js"), {
    respawn: true,
    token: config_1.config.bot.token,
    totalShards: 'auto',
    shardList: 'auto',
});
manager.spawn({
    amount: manager.totalShards,
    delay: 1,
    timeout: -1
}).then(shards => {
    logger.start(`[CLIENT] ${shards.size} shard(s) spawned.`);
}).catch(err => {
    logger.error('[CLIENT] An error has occurred :', err);
});
manager.on('shardCreate', shard => {
    shard.on('ready', () => {
        logger.start(`[CLIENT] Shard ${shard.id} connected to Discord's Gateway.`);
    });
});
//# sourceMappingURL=index.js.map