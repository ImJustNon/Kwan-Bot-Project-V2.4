import { ApplicationCommandOptionType, CommandInteraction, Guild, GuildChannel, GuildMember, Interaction, SlashCommandStringOption, VoiceBasedChannel } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { Player, SearchResult, Track } from "moonlink.js";
import ReplyEmbed from "../../utils/ReplyEmbed.util";
import ConvertTime from "../../utils/ConvertTime.util";


export default class ClearQueue extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "seek",
            description: {
                content: "Seek time",
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
                    name: 'duration',
                    description: 'ช่วงนาทีที่ต้องการข้ามไป เช่น 02:29',
                    type: 3,
                    required: true,
                },
            ],
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


        const durationPattern: RegExp = /^[0-5]?[0-9](:[0-5][0-9]){1,2}$/;
        const duration = interaction.options.get('duration')?.value as string;

        if(!player.current.isSeekable) return await interaction.reply(new ReplyEmbed().warn("เพลงนี้ไม่สามารถข้ามได้น่ะ"));
        if(!durationPattern.test(duration)) return await interaction.reply(new ReplyEmbed().warn("โปรดระบุรูปเเบบเวลาให้ถูกต้องด้วยน่ะ"));
        const durationMs = new ConvertTime().durationToMillis(duration);
        if(durationMs > player.current.duration) return await interaction.reply(new ReplyEmbed().warn("เวลาที่คุณระบุมาไม่ตรงกับความยาวของเพลงน่ะ"));

        player.seek(durationMs);
		await interaction.reply(new ReplyEmbed().success(`ทำการข้ามไปที่ ${new ConvertTime().convertTime(durationMs)} เรียบร้อยเเล้ว`));
    }
};
