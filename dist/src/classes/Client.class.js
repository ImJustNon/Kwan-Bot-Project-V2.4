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
exports.BotClient = void 0;
const discord_js_1 = require("discord.js");
const config_1 = require("../config/config");
const Logger_class_1 = require("./Logger.class");
const Command_loader_1 = __importDefault(require("../loaders/Command.loader"));
const Event_loader_1 = __importDefault(require("../loaders/Event.loader"));
const MoonLink_class_1 = require("./MoonLink.class");
const prisma_1 = require("../../generated/prisma");
const Feature_loader_1 = __importDefault(require("../loaders/Feature.loader"));
class BotClient extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this.commands = new discord_js_1.Collection();
        this.aliases = new discord_js_1.Collection();
        this.cooldown = new discord_js_1.Collection();
        this.config = config_1.config;
        this.logger = new Logger_class_1.Logger();
        this.body = [];
        this.manager = new MoonLink_class_1.MoonlinkClient(this);
        this.prisma = new prisma_1.PrismaClient();
    }
    startLogin(token) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.info(`Loading... commands!`);
            new Command_loader_1.default(this);
            this.logger.info(`Loading... events!`);
            new Event_loader_1.default(this);
            this.logger.info(`Loading... Features`);
            new Feature_loader_1.default(this);
            this.regisCommand();
            yield this.login(token);
        });
    }
    regisCommand() {
        this.once("ready", () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const applicationCommands = discord_js_1.Routes.applicationCommands(config_1.config.bot.id);
            try {
                const rest = new discord_js_1.REST({ version: "9" }).setToken((_a = this.config.bot.token) !== null && _a !== void 0 ? _a : "");
                yield rest.put(applicationCommands, {
                    body: this.body
                });
                this.logger.info(`Successfully register slash commands!`);
            }
            catch (error) {
                this.logger.error(error);
            }
        }));
    }
}
exports.BotClient = BotClient;
//# sourceMappingURL=Client.class.js.map