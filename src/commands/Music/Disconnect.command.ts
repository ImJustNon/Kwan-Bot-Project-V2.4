import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, Guild, GuildChannel, GuildMember, Interaction, SlashCommandStringOption } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { config } from "../../config/config";


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
            return await interaction.reply({ 
                content: `There is nothing playing in this server!`
            });
        }
        
        const voiceChannel = channel;
        if (!voiceChannel) {
            return await interaction.reply({ 
                content: `You need to be in a voice channel to use this command!`
            });
        }
        
        if (voiceChannel.id !== player.voiceChannelId) {
            return await interaction.reply({
                content: `You need to be in the same voice channel as the bot to use this command!`
            });
        }
        
        player.queue.clear();
        player.stop();
        
        const embed = new EmbedBuilder()
            .setDescription(`Stopped the player and cleared the queue`)
            .setColor("Green");
        
        await interaction.reply({ 
            embeds: [embed] 
        });
    }
};
