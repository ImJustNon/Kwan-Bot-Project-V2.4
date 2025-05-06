import { Collection, CommandInteraction, GuildMember, Interaction, InteractionType, PermissionFlagsBits } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Event } from "../../classes/Event.class";
import { Command } from "../../classes/Command.class";

export default class InteractionCreate extends Event {
    constructor(client: BotClient, file: string) {
        super(client, file, {
            name: "interactionCreate",
            type: "client"
        });
    }

    async callback(interaction: Interaction): Promise<any>{
        if(interaction instanceof CommandInteraction && interaction.type === InteractionType.ApplicationCommand){
            
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
                return await interaction.reply({
                    content: `🔴 | รู้สึกว่าจะไม่ได้ให้สิทธิ **\`SendMessage\`** ใน \`${interaction.guild.name}\`\n ช่อง: <#${interaction.channelId}> นะ`,
                }).catch(() => {});
            }
            // for check basic send message permission
            if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.EmbedLinks)){
                return await interaction.reply({
                    content: "🔴 | รู้สึกว่าจะไม่ได้ให้สิทธิ **`EmbedLinks`** นะ"
                }).catch(() => {});
            }

            // advance permission check
            if(command.permissions){
                if(command.permissions.client){
                    if(!interaction.guild.members.me.permissions.has(command.permissions.client)){
                        return await interaction.reply({
                            content: "🔴 | ดูเหมือนว่าจะไม่มีสิทธิ ตรงตามที่ต้องการ สำหรับใช้คำสั่งนี้นะฟ"
                        }).catch(() => {});
                    }
                }

                if(command.permissions.user){
                    const member = interaction.member as GuildMember;
                    if (!member.permissions.has(command.permissions.user)) {
                        return await interaction.reply({
                            content: "🔴 | You don't have enough permissions to use this command.",
                            ephemeral: true
                        }).catch(() => {});
                    } 
                }

                if(command.permissions.dev){
                    if(this.client.config.owners){
                        const findDev = this.client.config.owners.find((x) => x === interaction.user.id);
                        if(!findDev) return;
                    }
                }
            }

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
        // else if(interaction.type == InteractionType.ApplicationCommandAutocomplete){
        //     if (interaction.commandName == "play") {     
        //     }
        // }
    }
}