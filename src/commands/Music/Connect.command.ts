import { ApplicationCommandOptionType, CommandInteraction, Guild, GuildChannel, GuildMember, Interaction, SlashCommandStringOption, VoiceBasedChannel } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { Player, SearchResult, Track } from "moonlink.js";
import ReplyEmbed from "../../utils/ReplyEmbed.util";


export default class Connect extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "connect",
            description: {
                content: "Connect to Voice Channel",
                examples: [""],
                usage: "",
            },
            category: "Music",
            cooldown: 3,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks", "Connect"],
                user: [],
            },
            options: [],
        });
    }
    async callback(client: BotClient, interaction: CommandInteraction): Promise<any> {

        const guild: Guild | undefined = client.guilds.cache.get(interaction.guildId || "");
        const member: GuildMember | undefined = guild?.members.cache.get(interaction.member?.user.id || "");
        const voiceChannel: VoiceBasedChannel | undefined | null = member?.voice.channel;

        const me = guild?.members.cache.get(client.user?.id || "");

        if(!guild) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล Guild ที่อยู่ตอนนี้"));
        if(!member) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล User ที่ใช้อยู่ตอนนี้"));
        if(!me) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล Client ใน Guild นี้"));


        if(!voiceChannel) return await interaction.reply(new ReplyEmbed().warn("โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ"));
        
        
        let player: Player = client.manager.players.get(guild.id);
        if(player) return await interaction.reply(new ReplyEmbed().warn("ตอนนี้กำลังเชื่อมต่อช่องอื่นอยู่น่ะ"));

        player = client.manager.createPlayer({
            guildId: guild.id,
            textChannelId: interaction.channel!.id,
            voiceChannelId: voiceChannel.id,
            autoPlay: false,
        });
        
        player.connect({ setDeaf: true });
        
        await interaction.reply(new ReplyEmbed().success(`เข้าช่อง <#${voiceChannel.id}> มาเเล้วน่ะ`));
    }
};
