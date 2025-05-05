import { BotClient } from "../../classes/Client.class";
import { Feature } from "../../classes/Feature.class";

export default class AutoVoiceChannel extends Feature {
    constructor(client: BotClient, file: string){
        super(client, file, {
            name: "AutoVoiceChannel"
        });
    }

    async callback(client: BotClient) {

    }
}