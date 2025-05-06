import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, Guild, GuildChannel, GuildMember, Interaction, SlashCommandStringOption, VoiceBasedChannel } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { Player, SearchResult, Track } from "moonlink.js";
import ReplyEmbed from "../../utils/ReplyEmbed.util";
import ConvertTime from "../../utils/ConvertTime.util";
import ProgressBar from "../../utils/ProgressBar.util";
import playdl from 'play-dl';


export default class NowPlaying extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "now-playing",
            description: {
                content: "Show current track informations",
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
        
        // check avaiable player
        const player: Player = client.manager.players.get(guild.id);

        if(me.voice.channel && !voiceChannel.equals(me.voice.channel)) return await interaction.reply(new ReplyEmbed().warn("ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ"));
        if(!player || !player.current) return await interaction.reply(new ReplyEmbed().warn("ยังไม่มีการเล่นเพลง ณ ตอนนี้เลยน่ะ"));

        
        try{        
            let Np_embed = new EmbedBuilder()
                .setColor("Random")
                .setThumbnail(player.current.artworkUrl ?? null)
                .addFields([
                    {
                        name: `🎵 | กำลังเล่นเพลง`,
                        value: `> [${player.current.title}](${player.current.url})`,
                        inline: false,
                    },
                    {
                        name: `🎧 | ช่องฟังเพลง`,
                        value: `> <#${player.voiceChannelId}>`,
                        inline: true,
                    },
                    {
                        name: `📢 | ขอเพลงโดย`,
                        value: `> <@${JSON.parse(JSON.stringify(player.current.requestedBy))?.id}>`,
                        inline: true,
                    },
                    {
                        name: `⏱️ | ความยาว`,
                        value: `> \`${new ConvertTime().convertTime(player.current.duration)}\``,
                        inline: true,
                    },
                    {
                        name: `🎙 | ศิลปิน`,
                        value: `> \`${player.current.author}\``,
                        inline: true,
                    },
                    {
                        name: `🌀 | คิว`,
                        value: `> \`${player.queue.size}\``,
                        inline: true,
                    },
                    {
                        name: `🔁 | เปิดใช้วนซ้ำ`,
                        value: `> ${player.loop !== "off" ? "✅" : "❌"}`,
                        inline: true,
                    },
                    {
                        name: `🔊 | ระดับเสียง`,
                        value: `> \`${player.volume} %\``,
                        inline: true,
                    },
                ])
                .setFooter({text: client.user?.username ?? ""})
                .setTimestamp();
            

            Np_embed.addFields([
                {
                    name: ` `, 
                    value: `\`${new ConvertTime().convertTime(player.current.position)}\` ${(new ProgressBar(player.current.position, player.current.duration, 18)).bar} \`${new ConvertTime().convertTime(player.current.duration)}\``,
                    inline: false
                }
            ]);
        
            await interaction.reply({embeds: [ Np_embed ]});
        }
        catch(err){
            console.log(err);
            await interaction.reply(new ReplyEmbed().error("Error โปรดลองใหม่ในภายหลัง"));
        }
    }
};
