import { ApplicationCommandOptionType, ChatInputCommandInteraction, CommandInteraction, Guild, GuildMember, Interaction, SlashCommandStringOption } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import ReplyEmbed from "../../utils/ReplyEmbed.util";


export default class CommandDisable extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "command-disable",
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
            options: [
                {
                    name: "command-name",
                    description: `เลิอกคำสั่ง`,
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    autocomplete: true
                },
            ],
        });
    }
    async callback(client: BotClient, interaction: ChatInputCommandInteraction): Promise<any> {
        const commandName = interaction.options.getString("command-name");
        const guild: Guild | undefined = client.guilds.cache.get(interaction.guildId || "");
        const member: GuildMember | undefined = guild?.members.cache.get(interaction.member?.user.id || "");

        if(commandName === this.name) return await interaction.reply(new ReplyEmbed().warn("ไม่สามารถปิดใช้งานคำสั่งนี้ได้นะคะ"));
        
        if(!guild) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล Guild ที่อยู่ตอนนี้"));
        if(!member) return await interaction.reply(new ReplyEmbed().error("ไม่พบข้อมูล User ที่ใช้อยู่ตอนนี้"));
        const allCommands: string[] = client.commands.map(c => c.name);
        if(!allCommands.includes(commandName ?? "")) return await interaction.reply(new ReplyEmbed().warn(`ไม่พบคำสั่งที่ชื่อ /${commandName} นะคะ`));
        
        
        try {
            const findDuplicate = await client.prisma.guildDisabledCommand.findMany({
                where: {
                    guild_id: guild.id,
                    command_name: commandName!,
                }
            });
            if(findDuplicate.length !== 0) return await interaction.reply(new ReplyEmbed().warn(`คำสั่ง /${commandName} ได้ถูกตั้งค่าปิดใช่งานไว้เเล้วนะคะ`));

            await client.prisma.guildDisabledCommand.create({
                data: {
                    guild_id: guild.id,
                    command_name: commandName!,
                    creator_user_id: member.id
                }
            });

            await interaction.reply(new ReplyEmbed().success(`ตั้งค่าปิดการใช้งานคำสั่ง /${commandName} เรียบร้อยเเล้วค่ะ`));
        }   
        catch(e){
            return await interaction.reply(new ReplyEmbed().error("Internal Server Error"));
        }
    }
};
