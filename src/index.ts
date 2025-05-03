import { ShardingManager } from "discord.js";
import { config } from "./config/config";
import path from "path";
import { Logger } from "./classes/Logger.class";
import fs from "fs";


const logger: Logger = new Logger();


const manager = new ShardingManager(path.join(__dirname, "./client.js"), {
    respawn: true,
    token: config.bot.token,
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
