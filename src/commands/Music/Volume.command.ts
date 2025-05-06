import { ApplicationCommandOptionType, CommandInteraction, Guild, GuildChannel, GuildMember, Interaction, SlashCommandStringOption, VoiceBasedChannel } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { Player, SearchResult, Track } from "moonlink.js";
import ReplyEmbed from "../../utils/ReplyEmbed.util";
import ConvertTime from "../../utils/ConvertTime.util";


export default class ClearQueue extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "volume",
            description: {
                content: "Change Volume",
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
                    name: 'volume',
                    description: '0 - 100',
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


        let new_volume = interaction.options.get("volume")!.value as string;
        if(isNaN(Number(new_volume))) return interaction.reply(new ReplyEmbed().warn("โปรดระบุระดับความดังเป็นตัวเลขเท่านั้นน่ะ"));
        if(parseInt(new_volume) > 100) return interaction.reply(new ReplyEmbed().warn("ไม่สามารถเพิ่มเสียงมากกว่า \`100\` ได้น่ะ"));
        if(parseInt(new_volume) < 0) return interaction.reply(new ReplyEmbed().warn("ไม่สามารถลดเสียงน้อยกว่า \`0\` ได้น่ะ"));
        
        player.setVolume(parseInt(new_volume));
        await interaction.reply(new ReplyEmbed().success(`ตั้งค่าความดังเสียงเป็น \`${new_volume}\` เรียบร้อยเเล้ว`));
    }
};
