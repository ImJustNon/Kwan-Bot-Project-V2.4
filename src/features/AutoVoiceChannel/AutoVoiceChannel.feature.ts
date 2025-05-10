import { BotClient } from "../../classes/Client.class";
import { Feature } from "../../classes/Feature.class";
import VoiceStateUpdate from "./events/VoiceStateUpdate.event";
import AutoVoiceChannelStartup from "./Startup";

export default class AutoVoiceChannel extends Feature {
    constructor(client: BotClient, file: string){
        super(client, file, {
            name: "AutoVoiceChannel"
        });
    }

    async callback(client: BotClient) {
        new VoiceStateUpdate(client);
        // new AutoVoiceChannelStartup(client);
    }
}