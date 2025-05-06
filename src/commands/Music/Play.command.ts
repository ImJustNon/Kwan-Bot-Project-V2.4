import { ApplicationCommandOptionType, CommandInteraction, Guild, GuildChannel, GuildMember, Interaction, SlashCommandStringOption } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { SearchResult, Track } from "moonlink.js";
import ReplyEmbed from "../../utils/ReplyEmbed.util";


export default class Play extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "play",
            description: {
                content: "Play music as you want",
                examples: ["/play <keywords or URL>"],
                usage: "/play <keywords or URL>",
            },
            category: "Music",
            cooldown: 3,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            options: [
                {
                    name: 'search',
                    description: 'พิมพ์สิ้งที่ต้องการค้นหา หรือ ลิ้งค์',
                    type: 3,
                    required: true,
                },
                {
                    name: 'platform',
                    description: 'เเหล่งที่มา เช่น Youtube',
                    type: 3,
                    choices: [
                        {
                            name: "Youtube",
                            value: 'ytsearch',
                        },
                        {
                            name: "Spotify",
                            value: 'spsearch',
                        }
                    ],
                    required: false,
                },
            ],
        });
    }
    async callback(client: BotClient, interaction: CommandInteraction): Promise<any> {
        const query: string = interaction.options.get('search')?.value as string;
        const source: string = interaction.options.get('platform')?.value as string;
        const guild = client.guilds.cache.get(interaction.guildId ?? "") as Guild;
        const member = guild?.members.cache.get(interaction.member?.user.id ?? "") as GuildMember;
        const channel = member?.voice.channel as GuildChannel;

        const me = guild.members.cache.get(client.user?.id ?? "") as GuildMember;

        if(!channel){
            return await interaction.reply(new ReplyEmbed().warn("โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ"));
        }
        if(me.voice.channel && !channel.equals(me.voice.channel)){
            return await interaction.reply(new ReplyEmbed().warn("ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ"));
        } 
        if(!query){
            return await interaction.reply(new ReplyEmbed().warn("โปรดระบุเพลงที่ต้องการด้วยน่ะ"));
        } 

        let player = client.manager.players.get(guild.id) || client.manager.createPlayer({
            guildId: interaction.guildId!,
            voiceChannelId: channel.id,
            textChannelId: interaction.channelId,
            autoPlay: false
        });
        if (!player.connected) player.connect({ setDeaf: true });

        const searchResult: SearchResult = await client.manager.search({ 
            query: query, 
            // source: source ?? "ytsearch",
            requester: interaction.user.id 
        });

        if (!searchResult.tracks.length) {
            return await interaction.reply(new ReplyEmbed().error(`ไม่พบผลการค้นหาสำหรับ ${query}`));
        }
        if (searchResult.loadType == "playlist") {  
            for (const track of searchResult.tracks) {
                player.queue.add(track);
            }
            await interaction.reply(new ReplyEmbed().success(`${searchResult.playlistInfo.name} has been loaded with ${searchResult.tracks.length}`));
        } else {
            const track: Track = searchResult.tracks[0];
            track.requestedBy = interaction.user;
            player.queue.add(track);
            await interaction.reply(new ReplyEmbed().success(`Queued Track \n \`${track.title}\``));
        }

        if (!player.playing) {
            player.play();
        }
    }
};
