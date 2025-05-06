import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction, EmbedBuilder, Guild, GuildChannel, GuildMember, Interaction, SlashCommandStringOption, VoiceBasedChannel } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { Player, SearchResult, Track } from "moonlink.js";
import ReplyEmbed from "../../utils/ReplyEmbed.util";
import ConvertTime from "../../utils/ConvertTime.util";
import ProgressBar from "../../utils/ProgressBar.util";
import playdl from 'play-dl';
import { config } from "../../config/config";


export default class Queue extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "queue",
            description: {
                content: "Show All Queue",
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



        if(!player.queue.size || player.queue.size === 0 || !player.queue || player.queue.size === 0) return await interaction.reply(new ReplyEmbed().warn("คุณยังไม่มีคิวการเล่นน่ะ"));

        let testQueueMsg: string = "";
        let memQueueMsg: string = "";
        const queueOrder: string[] = [];


        for(let i = 0; i < player.queue.size; i++){
            const requester: GuildMember | undefined = guild.members.cache.get(player.queue.get(i)?.requestedBy as string);
            testQueueMsg += `\`${i + 1})\` [${new ConvertTime().convertTime(player.queue.get(i).duration)}] - ${player.queue.get(i).title}\n╰  **เพิ่มโดย** : <@${requester?.user.id}> \n`;
            if(testQueueMsg.length > 1000 || (i + 1 === player.queue.size)) {
                queueOrder.push(memQueueMsg);
                testQueueMsg = "";
                memQueueMsg = "";
            }
            memQueueMsg = testQueueMsg;
        }


        const queueClass = new QueueClass(client, queueOrder);
        const row = queueClass.button();
        const queueEmbed = queueClass.embed();

        const starterMessage = await interaction.reply({
            embeds: [queueEmbed],
            components: [row]
        }); 

        const collector = starterMessage.createMessageComponentCollector({ time: 120000 });

        collector.on('collect', async (i: ButtonInteraction) => {
            if (!i.isButton()) return;

            if(i.customId === "next"){
                queueClass.next();
                await starterMessage.edit({
                    embeds: [ queueClass.embed() ],
                    components: [ queueClass.button() ]
                }).catch(e => {});
            }
            else if(i.customId === "previous"){
                queueClass.previous();
                await starterMessage.edit({
                    embeds: [ queueClass.embed() ],
                    components: [ queueClass.button() ]
                }).catch(e => {});
            }
            await i.deferUpdate();
        });

        collector.on('end', () => {
            starterMessage.delete().catch(e => {});
        });

    }
};

class QueueClass {
    private currentIndex: number;
    private queueOrder: string[];
    private client: BotClient;

    constructor(client: BotClient, queueOrder: string[]){
        this.queueOrder = queueOrder;
        this.currentIndex = 0;
        this.client = client;
    }

    public embed(): EmbedBuilder{
        return new EmbedBuilder()
            .setColor(config.assets.embed.default.color)
            .setTitle(`📝 | รายการคิวเพลงทั้งหมด [หน้าที่ ${this.currentIndex + 1}]`)
            .setDescription(this.queueOrder[this.currentIndex])
            .setFooter({text: this.client.user?.username ?? ""})
            .setTimestamp();
    }
    
    public button(): ActionRowBuilder<ButtonBuilder> {
        return new ActionRowBuilder<ButtonBuilder>().addComponents([
            new ButtonBuilder().setCustomId('previous').setLabel('◀️ | Previous').setStyle(ButtonStyle.Primary).setDisabled(this.currentIndex <= 0),
            new ButtonBuilder().setCustomId('next').setLabel('Next | ▶️').setStyle(ButtonStyle.Primary).setDisabled(this.currentIndex >= this.queueOrder.length - 1)
        ]);
    }

    public next(){
        if(this.currentIndex < this.queueOrder.length - 1){
            this.currentIndex++;
        }
    }
    public previous(){
        if(this.currentIndex > 0){
            this.currentIndex--;
        }
    }
}