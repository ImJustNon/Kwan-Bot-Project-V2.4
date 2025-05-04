import { BotClient } from "../../classes/Client.class";
import { Feature } from "../../classes/Feature.class";
export default class MusicChannel extends Feature {
    constructor(client: BotClient, file: string);
    callback(client: BotClient): Promise<void>;
}
