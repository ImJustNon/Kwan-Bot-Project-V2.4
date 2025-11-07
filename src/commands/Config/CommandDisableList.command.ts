import { ApplicationCommandOptionType, ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, Guild, GuildMember, Interaction, SlashCommandStringOption } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import ReplyEmbed from "../../utils/ReplyEmbed.util";
import { config } from "../../config/config";
import { GuildDisabledCommand } from "../../models/GuildDisabledCommand.model";


export default class CommandDisableList extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "command-disable-list",
            description: {
                content: "Disable Command in your guild",
                examples: [""],
                usage: "",
            },
            category: "Config",
            cooldown: 3,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: ["Administrator"],
            },
            options: [],
        });
    }
    async callback(client: BotClient, interaction: ChatInputCommandInteraction): Promise<any> {
        const commandName = interaction.options.getString("command-name");
        const guild: Guild | undefined = client.guilds.cache.get(interaction.guildId || "");
        const member: GuildMember | undefined = guild?.members.cache.get(interaction.member?.user.id || "");

        if(commandName === this.name) return await interaction.reply(new ReplyEmbed().warn("ไม่สามารถปิดใช้งานคำสั่งนี้ได้นะคะ"));
        
        if(!guild) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล Guild ที่อยู่ตอนนี้"));
        if(!member) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล User ที่ใช้อยู่ตอนนี้"));

        
        try {
            const findDisabledCommands = await GuildDisabledCommand.find({
                guild_id: guild.id
            });

            if(findDisabledCommands.length === 0) return await interaction.reply(new ReplyEmbed().warn('ไม่การตั้งค่าการปิดใช้งานคำสั่งใน Guild นี้นะคะ'));

            const embed: EmbedBuilder = new EmbedBuilder().setColor(config.assets.embed.default.color).setTitle(`⚙️ | รายการคำสั่งที่ถูกปิดใช้งานเเล้ว`).setFooter({text: client.user?.username ?? ""}).setTimestamp();
            for(const cmd of findDisabledCommands){
                embed.addFields({
                    name: `คำสั่ง : \`/${cmd.command_name}\``,
                    value: `ปิดโดย : <@${cmd.author_id}>`,
                    inline: true
                });
            }
            
            await interaction.reply({ embeds: [ embed ] });
        }   
        catch(e){
            return await interaction.reply(new ReplyEmbed().error("Internal Server Error"));
        }
    }
};
