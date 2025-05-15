import { ChannelType, Guild } from "discord.js";
import { BotClient } from "../classes/Client.class";

export default class UpdateData {
    result: string = "";
    client: BotClient;
    guild: Guild;
    text: string;

    constructor(client: BotClient, guild: Guild, text: string){
        this.client = client;
        this.guild = guild
        this.text = text;

        if(text.includes("%COUNT_MEMBERS_ALL%")){
            this.replace_CountMembersAll();
        }
        else if(text.includes("%COUNT_MEMBERS_USERS%")){
            this.replace_CountMembersUsers();
        }
        else if(text.includes("%COUNT_MEMBERS_BOTS%")){
            this.replace_CountMembersBots();
        }
        else if(text.includes("%COUNT_CHANNELS_VOICE%")){
            this.replace_CountChannelsVoice();
        }
        else if(text.includes("%COUNT_CHANNELS_TEXT%")){
            this.replace_CountChannelsText();
        }
        else {
            this.result = text;
        }
    }

    replace_CountMembersAll(){
        const replaceText = String(this.guild.members.cache.size);
        this.result = this.text.replace("%COUNT_MEMBERS_ALL%", replaceText);
    }

    replace_CountMembersUsers(){
        const replaceText = String(this.guild.members.cache.filter(m => !m.user.bot).size);
        this.result = this.text.replace("%COUNT_MEMBERS_USERS%", replaceText);
    }

    replace_CountMembersBots(){
        const replaceText = String(this.guild.members.cache.filter(m => m.user.bot).size);
        this.result = this.text.replace("%COUNT_MEMBERS_BOTS%", replaceText);
    }

    replace_CountChannelsVoice(){
        const replaceText = String(this.guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size);
        this.result = this.text.replace("%COUNT_CHANNELS_VOICE%", replaceText);
    }

    replace_CountChannelsText(){
        const replaceText = String(this.guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size);
        this.result = this.text.replace("%COUNT_CHANNELS_TEXT%", replaceText);
    }

    getResult(){
        return this.result;
    }
}
