import { ApplicationCommandOptionType, ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, Guild, GuildChannel, GuildMember, Interaction, SlashCommandStringOption, TextChannel, VoiceBasedChannel } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { Player, SearchResult, Track } from "moonlink.js";
import ReplyEmbed from "../../utils/ReplyEmbed.util";
import ConvertTime from "../../utils/ConvertTime.util";
import ProgressBar from "../../utils/ProgressBar.util";
import playdl from 'play-dl';
import { config } from "../../config/config";


export default class Search extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "search",
            description: {
                content: "Search song",
                examples: [""],
                usage: "",
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
                    name: 'query',
                    description: 'สามารถใส่ URL หรือ ค้นหา ได้',
                    type: 3,
                    required: true,
                },
            ],
        });
    }
    async callback(client: BotClient, interaction: ChatInputCommandInteraction): Promise<any> {

        const guild: Guild | undefined = client.guilds.cache.get(interaction.guildId || "");
        const member: GuildMember | undefined = guild?.members.cache.get(interaction.member?.user.id || "");
        const voiceChannel: VoiceBasedChannel | undefined | null = member?.voice.channel;

        const me = guild?.members.cache.get(client.user?.id || "");

        if(!guild) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล Guild ที่อยู่ตอนนี้"));
        if(!member) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล User ที่ใช้อยู่ตอนนี้"));
        if(!me) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล Client ใน Guild นี้"));

        if(!voiceChannel) return await interaction.reply(new ReplyEmbed().warn("โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ"));
        
        // check avaiable player
        let player: Player = client.manager.players.get(guild.id);

        if(me.voice.channel && !voiceChannel.equals(me.voice.channel)) return await interaction.reply(new ReplyEmbed().warn("ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ"));
        


        const query = interaction.options.get("query")?.value as string;
        const results = await client.manager.search({
            query: query,
            requester: interaction.user.id,
        });
        const tracks = results.tracks.slice(0, 20);
        let resultsDescription = "";
	    let counter = 1;

        for(const track of tracks){
            resultsDescription += `\`${counter}\` [${track.title}](${track.url}) \n`;
            counter++;
        }

        const embed = new EmbedBuilder()
            .setTitle(`🔎 | รายการการค้นหาของ ${query}`)
            .setDescription(resultsDescription)
            .setColor("Random")
            .setFooter({text: client.user?.username ?? ""})
            .setTimestamp();

        await interaction.reply({ 
            content: "โปรดเลือกตัวเลือกที่ต้องการจากรายการด้านล่างได้เลยน่ะ",
            embeds: [ embed ],
        });
        
        const textChannel = client.channels.cache.get(interaction.channel!.id) as TextChannel;
        const response = await textChannel?.awaitMessages({ 
            filter: (msg) => msg.author.id === interaction.user.id && !isNaN(Number(msg.content)),
            max: 1,
            time: 30000,
        });
        const answer = response.first()!.content;
        const track = tracks[parseInt(answer) - 1];

        if(player){
            player.queue.add(track);
            return await textChannel.send(new ReplyEmbed().success(`เพิ่มเพลง \`${track.title}\` เรียบร้อยเเล้ว`));
        }
        else {
            player = client.manager.createPlayer({
                guildId: guild.id,
                textChannelId: textChannel.id,
                voiceChannelId: voiceChannel.id,
                autoPlay: false,
            });
            if(!player.connected){ 
                player.connect({ 
                    setDeaf: true,
                });
            }
            player.queue.add(track);
            player.play();
            await textChannel.send(new ReplyEmbed().success(`เพิ่มเพลง \`${track.title}\` เรียบร้อยเเล้ว`));
        }
    }
};
