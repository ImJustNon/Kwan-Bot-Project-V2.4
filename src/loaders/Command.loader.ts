import { BotClient } from "../classes/Client.class";
import fs from "fs";
import path from "path";
import { Command } from "../classes/Command.class";
import { ApplicationCommandType } from "discord.js";


export default class CommandLoader {

    constructor(client: BotClient) {
        const commandsPath = fs.readdirSync(path.join(__dirname, "../commands"));
        commandsPath.forEach((dir) => {
            const commandFiles = fs.readdirSync(path.join(__dirname, `../commands/${dir}`)).filter((file) => file.includes(".command"));
            commandFiles.forEach(async (file) => {
                import(path.join(__dirname, `../commands/${dir}/${file}`)).then(async(data) =>{
                    const cmd: Command = new data.default(this, file);
                    cmd.category = dir;
                    client.commands.set(cmd.name, cmd);
                    const bodyData = {
                        name: cmd.name,
                        description: cmd.description?.content,
                        type: ApplicationCommandType.ChatInput,
                        options: cmd.options ? cmd.options : null,
                        // default_member_permissions: cmd.permissions.user.length > 0 ? cmd.permissions.user : null,
                    }
                    client.logger.success(`Loaded Command | ${cmd.name}`)
                    // if (cmd.permissions.user.length > 0) {
                    //     const permissionValue = PermissionsBitField.resolve(cmd.permissions.user);
                    //     if (typeof permissionValue === "bigint") {
                    //         bodyData.default_member_permissions = permissionValue.toString();
                    //     } else {
                    //         bodyData.default_member_permissions = permissionValue;
                    //     }
                    // }
                    const json: string = JSON.stringify(bodyData);
                    client.body.push(JSON.parse(json));
                });
            });
        });
    }
}