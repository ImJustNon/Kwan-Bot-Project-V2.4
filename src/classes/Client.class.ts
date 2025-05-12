import { ApplicationCommandType, Client, ClientOptions, Collection, PermissionResolvable, PermissionsBitField, REST, Routes } from "discord.js";
import { Config, config } from "../config/config";
import { Logger } from "./Logger.class";
import fs from "fs";
import path from "path";
import { Command } from "./Command.class";
import { Event } from "./Event.class";
import CommandLoader from "../loaders/Command.loader";
import EventLoader from "../loaders/Event.loader";
import { MoonlinkClient } from "./MoonLink.class";
import { PrismaClient } from "../../generated/prisma";
import FeatureLoader from "../loaders/Feature.loader";
import App from "../apis/App";
import mongoose, { Mongoose } from "mongoose";
import MongoDB from "../database/MongoDB.db";

export class BotClient extends Client {
    commands: Collection<string, Command>;
    aliases: Collection<any, any>;
    cooldown: Collection<any, any>;
    config: Config;
    logger: Logger;
    body: any[];
    manager: MoonlinkClient;
    prisma: PrismaClient;
    mongoose: Mongoose;

    constructor(options: ClientOptions){
        super(options);
        this.commands = new Collection();
        this.aliases = new Collection();
        this.cooldown = new Collection();
        this.config = config;
        this.logger = new Logger();
        this.body = [];
        this.manager = new MoonlinkClient(this);
        this.prisma = new PrismaClient();
        this.mongoose = mongoose;
    }

    async startLogin(token: string){
        this.logger.info(`Connecting... mongodb!`);
        new MongoDB(this);
        this.logger.info(`Loading... commands!`);
        new CommandLoader(this);
        this.logger.info(`Loading... events!`);
        new EventLoader(this);
        this.logger.info(`Loading... Features!`);
        new FeatureLoader(this);
        this.logger.info(`Loading... API!`);
        const app = new App(this);
        this.regisCommand();
        await this.login(token).then(() => app.start());
    }


    regisCommand(){
        this.once("ready", async () => {
            const applicationCommands = Routes.applicationCommands(config.bot.id);
            try {
                const rest = new REST({ version: "9" }).setToken(
                    this.config.bot.token ?? ""
                );
                await rest.put(applicationCommands, { 
                    body: this.body 
                });
                this.logger.info(`Successfully register slash commands!`);
            } catch (error) {
              this.logger.error(error);
            }
        });
    }
}
