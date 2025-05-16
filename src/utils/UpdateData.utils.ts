import { ChannelType, Guild, PresenceUpdateStatus } from "discord.js";
import { BotClient } from "../classes/Client.class";
import { ServerStatsPrefix } from "../enums/ServerStats.enum";

export default class UpdateData {
    result: string = "";
    client: BotClient;
    guild: Guild;
    text: string;

    constructor(client: BotClient, guild: Guild, text: string){
        this.client = client;
        this.guild = guild
        this.text = text;

        if(text.includes(ServerStatsPrefix.CountMembersAll)){
            this.replace_CountMembersAll();
        }
        else if(text.includes(ServerStatsPrefix.CountMembersUsers)){
            this.replace_CountMembersUsers();
        }
        else if(text.includes(ServerStatsPrefix.CountMembersBots)){
            this.replace_CountMembersBots();
        }
        else if(text.includes(ServerStatsPrefix.CountMembersOnline)){
            this.replace_CountMembersOnline();
        }
        else if(text.includes(ServerStatsPrefix.CountMembersDnd)){
            this.replace_CountMembersDnd();
        }
        else if(text.includes(ServerStatsPrefix.CountMembersIdle)){
            this.replace_CountMembersIdle();
        }
        else if(text.includes(ServerStatsPrefix.CountMembersOffline)){
            this.replace_CountMembersOffline();
        }
        else if(text.includes(ServerStatsPrefix.CountChannelsVoice)){
            this.replace_CountChannelsVoice();
        }
        else if(text.includes(ServerStatsPrefix.CountChannelsText)){
            this.replace_CountChannelsText();
        }
        else {
            this.result = text;
        }
    }

    replace_CountMembersAll(){
        const replaceText = String(this.guild.members.cache.size);
        this.result = this.text.replace(ServerStatsPrefix.CountMembersAll, replaceText);
    }

    replace_CountMembersUsers(){
        const replaceText = String(this.guild.members.cache.filter(m => !m.user.bot).size);
        this.result = this.text.replace(ServerStatsPrefix.CountMembersUsers, replaceText);
    }

    replace_CountMembersBots(){
        const replaceText = String(this.guild.members.cache.filter(m => m.user.bot).size);
        this.result = this.text.replace(ServerStatsPrefix.CountMembersBots, replaceText);
    }

    replace_CountMembersOnline(){
        const replaceText = String(this.guild.members.cache.filter(m => m.presence?.status === PresenceUpdateStatus.Online).size);
        this.result = this.text.replace(ServerStatsPrefix.CountMembersOnline, replaceText);
    }

    replace_CountMembersDnd(){
        const replaceText = String(this.guild.members.cache.filter(m => m.presence?.status === PresenceUpdateStatus.DoNotDisturb).size);
        this.result = this.text.replace(ServerStatsPrefix.CountMembersDnd, replaceText);
    }

    replace_CountMembersIdle(){
        const replaceText = String(this.guild.members.cache.filter(m => m.presence?.status === PresenceUpdateStatus.Idle).size);
        this.result = this.text.replace(ServerStatsPrefix.CountMembersIdle, replaceText);
    }

    replace_CountMembersOffline(){
        const replaceText = String(this.guild.members.cache.filter(m => m.presence?.status === PresenceUpdateStatus.Offline).size);
        this.result = this.text.replace(ServerStatsPrefix.CountMembersOffline, replaceText);
    }

    replace_CountChannelsVoice(){
        const replaceText = String(this.guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size);
        this.result = this.text.replace(ServerStatsPrefix.CountChannelsVoice, replaceText);
    }

    replace_CountChannelsText(){
        const replaceText = String(this.guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size);
        this.result = this.text.replace(ServerStatsPrefix.CountChannelsText, replaceText);
    }

    getResult(){
        return this.result;
    }
}
