import { VoiceState } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";
export default class VoiceStateUpdate extends Event {
    constructor(client: BotClient, file: string);
    callback(oldState: VoiceState, newState: VoiceState): Promise<void>;
    checkDisconnect(oldState: VoiceState, newState: VoiceState): Promise<void>;
    checkEmptyChannel(oldMember: VoiceState, newMember: VoiceState): Promise<void>;
}
