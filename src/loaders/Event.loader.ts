import { BotClient } from "../classes/Client.class";
import fs from "fs";
import path from "path";
import { Event } from "../classes/Event.class";
import { IEvents } from "moonlink.js";
import { ClientEvents } from "discord.js";


export default class EventLoader {
    constructor(client: BotClient){
        const eventsPath = fs.readdirSync(path.join(__dirname, "../events"));
        eventsPath.forEach((dir) => {
            try {
                const events = fs.readdirSync(path.join(__dirname, `../events/${dir}`)).filter((file) => file.includes(".event"));
                events.forEach((file) => {
                try {
                    import(path.join(__dirname, `../events/${dir}/${file}`)).then(async(fileData) =>{
                        const evt: Event = new fileData.default(client, file);

                        if(dir === "Player"){
                            client.manager.on(evt.name as keyof IEvents, (...args: any) => evt.callback(...args));
                        }
                        else if (dir === "Client"){
                            client.on(evt.name as keyof ClientEvents, (...args: any) => evt.callback(...args));
                        }
                        client.logger.success(`Loaded Event | ${evt.name}`);
                    });
                } catch (error) {
                    console.error(`Error loading event ${file}:`, error);
                }
                });
            } catch (error) {
                console.error(`Error reading directory ${dir}:`, error);
            }
        });
    }
}