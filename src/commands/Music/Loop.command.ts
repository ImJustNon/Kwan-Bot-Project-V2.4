import { ApplicationCommandOptionType, CacheType, CommandInteraction, CommandInteractionOption, Guild, GuildChannel, GuildMember, Interaction, SlashCommandStringOption, VoiceBasedChannel } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { Player, SearchResult, Track } from "moonlink.js";
import ReplyEmbed from "../../utils/ReplyEmbed.util";


export default class Loop extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "loop",
            description: {
                content: "Loop music as Track/Queue or turn off",
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
                    name: "option",
                    description: `เลือกการเล่นวนซ้ำ หรือ ปิดการใช้งาน`,
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: "เพลงเดียว",
                            value: 'track',
                        },
                        {
                            name: "ทั้งหมด",
                            value: 'queue',
                        },
                        {
                            name: "ปิดการใช้งาน",
                            value: 'disable',
                        },
                    ],
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


        // get option
        const loop_type: string = interaction.options.get('option')?.value as string;

        if(loop_type === 'track'){
            if(player.loop === "track"){
                return await interaction.reply(new ReplyEmbed().warn("ทำการเปิดการวนซ้ำเเบบ \`เพลงเดียว\` อยู่น่ะ"));
            }
            player.setLoop("track"); 
            await interaction.reply(new ReplyEmbed().success("ทำการเปิดการวนซ้ำเเบบ \`เพลงเดียว\` เรียบร้อยเเล้ว"));
        }
        else if(loop_type === 'queue'){
            if(player.loop === "queue"){
                return await interaction.reply(new ReplyEmbed().warn("ทำการเปิดการวนซ้ำเเบบ \`ทั้งหมด\` อยู่นะ"));
            }
            player.setLoop("queue");
            await interaction.reply(new ReplyEmbed().success("ทำการเปิดการวนซ้ำเเบบ \`ทั้งหมด\` เรียบร้อยเเล้ว"));
        }
        else if(loop_type === 'disable'){
            if(player.loop === "off"){
                return await interaction.reply(new ReplyEmbed().warn("ยังไม่มีการเปิดใช้งานการวนซ้ำเลยน่ะ"));
            }
            player.setLoop("off");
            await interaction.reply(new ReplyEmbed().success("ทำการ \`ปิด\` การใช้งานวนซ้ำ เรียบร้อยเเล้ว"));
        }
    }
};
