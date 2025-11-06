import { Collection, CommandInteraction, GuildMember, Interaction, InteractionType, MessageFlags, PermissionFlagsBits } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";
import { Command } from "../../classes/Command.class";
import { SearchResult } from "moonlink.js";
import ReplyEmbed from "../../utils/ReplyEmbed.util";
import { GuildCommandChannel } from "../../models/GuildCommandChannel.model";
import { GuildDisabledCommand } from "../../models/GuildDisabledCommand.model";

export default class InteractionCreate extends Event {
    constructor(client: BotClient, file: string) {
        super(client, file, {
            name: "interactionCreate",
            type: "client"
        });
    }

    async callback(interaction: Interaction): Promise<any>{
        if(interaction instanceof CommandInteraction && interaction.type === InteractionType.ApplicationCommand){
            try {
                // get and validate command by command name
                const commandName = interaction.commandName;
                const command: Command | undefined = this.client.commands.get(interaction.commandName);
                if(!command) return;
            
                // if not in guild then return
                if(!interaction.inGuild()) return;
                
                // if me is not in guild then return
                const me = interaction.guild?.members.me;
                if(!me) return;

                // get current channel and data check basic permission
                const channel = interaction.channel;
                if(!channel?.permissionsFor(me)?.has(PermissionFlagsBits.SendMessages)) return;
                // if basic permission not found then return
                if(!interaction.guild.members.me?.permissions.has(PermissionFlagsBits.SendMessages)){
                    return await interaction.reply(new ReplyEmbed().error(`รู้สึกว่าจะไม่ได้ให้สิทธิ **\`SendMessage\`** ใน \`${interaction.guild.name}\`\n ช่อง: <#${interaction.channelId}> นะคะ`)).catch(() => {});
                }
                // for check basic send message permission
                if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.EmbedLinks)){
                    return await interaction.reply(new ReplyEmbed().error(`รู้สึกว่าจะไม่ได้ให้สิทธิ **\`EmbedLinks\`** นะคะ`)).catch(() => {});
                }


                // guild command channel check
                // const findGuildCommandChannel = await this.client.prisma.guildCommandChannel.findUnique({
                //     where: {
                //         guild_id: interaction.guild.id
                //     },
                //     select: {
                //         channel_id: true
                //     }
                // });
                const findGuildCommandChannel = await GuildCommandChannel.findOne({
                    guild_id: interaction.guild.id
                });
                if(findGuildCommandChannel && findGuildCommandChannel.channel_id !== interaction.channelId) return await interaction.reply({...new ReplyEmbed().warn(`โปรดใช้คำสั่งในช่อง <#${findGuildCommandChannel.channel_id}> เท่านั้นนะคะ`), flags: MessageFlags.Ephemeral});


                // guild disable command check
                // const findGuildDisabledCommand = await this.client.prisma.guildDisabledCommand.findMany({
                //     where: {
                //         guild_id: interaction.guild.id,
                //         command_name: command.name
                //     },
                //     select: {
                //         creator_user_id: true
                //     }
                // });
                const findGuildDisabledCommand = await GuildDisabledCommand.find({
                    guild_id: interaction.guild.id,
                    command_name: command.name
                });
                if(findGuildDisabledCommand.length !== 0) return await interaction.reply(new ReplyEmbed().warn(`คำสั่งนี้ได้ถูกปิดใช้งานโดย <@${findGuildDisabledCommand[0].author_id}>`));


                // advance permission check
                if(command.permissions){
                    if(command.permissions.client){
                        if(!interaction.guild.members.me.permissions.has(command.permissions.client)){
                            return await interaction.reply(new ReplyEmbed().error(`ดูเหมือนว่าจะไม่มีสิทธิ ตรงตามที่ต้องการ สำหรับใช้คำสั่งนี้นะคะ`)).catch(() => {});
                        }
                    }

                    if(command.permissions.user){
                        const member = interaction.member as GuildMember;
                        if (!member.permissions.has(command.permissions.user)) {
                            return await interaction.reply(new ReplyEmbed().warn(`ดูเหมือนว่าคุณไม่มีสิทธิมากพอที่จะใช้คำสั่งนี้นะคะ`)).catch(() => {});
                        } 
                    }

                    if(command.permissions.dev){
                        if(this.client.config.owners){
                            const findDev = this.client.config.owners.find((x) => x === interaction.user.id);
                            if(!findDev) return await interaction.reply(new ReplyEmbed().warn(`คำสั่งนี้กำลังอยู่ในขั้นตอนการพัฒนา โปรดรออัปเดต นะคะ`));
                        }
                    }
                }

                // cooldown check
                if (!this.client.cooldown.has(commandName)) {
                    this.client.cooldown.set(commandName, new Collection());
                }
                const now = Date.now();
                const timestamps = this.client.cooldown.get(commandName);
                const cooldownAmount = Math.floor(command.cooldown || 5) * 1000;
                if (!timestamps.has(interaction.user.id)){
                    timestamps.set(interaction.user.id, now);
                    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
                } else {
                    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                    const timeLeft = (expirationTime - now) / 1000;
                    if (now < expirationTime && timeLeft > 0.9) {
                        return await interaction.reply({
                            content: `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandName}\` command.`,
                        });
                    }
                    timestamps.set(interaction.user.id, now);
                    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
                }

                try {
                    await command.callback(this.client, interaction);
                } catch (error) {
                    this.client.logger.error(error);
                    await interaction.reply({ content: `An error occurred: \`${error}\`` });
                }
            }
            catch(e){
                await interaction.reply(new ReplyEmbed().error("Internal Server Error"));
                console.log(e);
            }
        }
        else if(interaction.type == InteractionType.ApplicationCommandAutocomplete){
            if (interaction.commandName == "command-disable" || interaction.commandName == "command-enable") {  
                const search = interaction.options.getString("command-name");
                const commandChoices: {name: string, value: string}[] = this.client.commands.filter(c => search && search.length > 0 ? c.name.includes(search) : true).map(c => ({ name: c.name, value: c.name }));
                return await interaction.respond(commandChoices.slice(0, 25)).catch(() => { });
            }
        }
    }
}