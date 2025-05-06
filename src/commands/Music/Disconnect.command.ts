import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, Guild, GuildChannel, GuildMember, Interaction, SlashCommandStringOption } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { config } from "../../config/config";
import ReplyEmbed from "../../utils/ReplyEmbed.util";


export default class Disconnect extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "disconnect",
            description: {
                content: "Disconnect bot from playing channel",
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
        const guild = client.guilds.cache.get(interaction.guildId ?? "") as Guild;
        const member = guild?.members.cache.get(interaction.member?.user.id ?? "") as GuildMember;
        const channel = member?.voice.channel as GuildChannel;
        const player = client.manager.players.get(guild.id);
        
        if (!player) {
            return await interaction.reply(new ReplyEmbed().warn("ยังไม่มีการเล่นเพลง ณ ตอนนี้เลยน่ะ"));
        }
        
        const voiceChannel = channel;
        if (!voiceChannel) {
            return await interaction.reply(new ReplyEmbed().warn("โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ"));
        }
        
        if (voiceChannel.id !== player.voiceChannelId) {
            return await interaction.reply(new ReplyEmbed().warn("ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ"));
        }
        
        player.queue.clear();
        player.stop();        
        await interaction.reply(new ReplyEmbed().success("ทำการปิดเพลงเรียบร้อยเเล้ว"));
    }
};
