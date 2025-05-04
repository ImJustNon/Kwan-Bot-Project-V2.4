"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const discord_js_1 = require("discord.js");
class CommandLoader {
    constructor(client) {
        const commandsPath = fs_1.default.readdirSync(path_1.default.join(__dirname, "../commands"));
        commandsPath.forEach((dir) => {
            const commandFiles = fs_1.default.readdirSync(path_1.default.join(__dirname, `../commands/${dir}`)).filter((file) => file.includes(".command"));
            commandFiles.forEach((file) => __awaiter(this, void 0, void 0, function* () {
                Promise.resolve(`${path_1.default.join(__dirname, `../commands/${dir}/${file}`)}`).then(s => __importStar(require(s))).then((data) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const cmd = new data.default(this, file);
                    cmd.category = dir;
                    client.commands.set(cmd.name, cmd);
                    const bodyData = {
                        name: cmd.name,
                        description: (_a = cmd.description) === null || _a === void 0 ? void 0 : _a.content,
                        type: discord_js_1.ApplicationCommandType.ChatInput,
                        options: cmd.options ? cmd.options : null,
                    };
                    client.logger.success(`Loaded Command | ${cmd.name}`);
                    const json = JSON.stringify(bodyData);
                    client.body.push(JSON.parse(json));
                }));
            }));
        });
    }
}
exports.default = CommandLoader;
//# sourceMappingURL=Command.loader.js.map