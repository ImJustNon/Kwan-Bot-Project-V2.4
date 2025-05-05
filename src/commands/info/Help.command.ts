import { ActionRowBuilder, AnyComponentBuilder, APIEmbedField, APIMessageComponentEmoji, APISelectMenuOption, ApplicationCommandOptionType, Collection, CommandInteraction, ComponentType, EmbedBuilder, Interaction, InteractionCallbackResponse, InteractionResponse, RestOrArray, SlashCommandStringOption, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { config } from "../../config/config";
import axios from "axios";

export default class Help extends Command {
	constructor(client: BotClient) {
		super(client, {
			name: "help",
			description: {
				content: "Shows the help menu",
				examples: ["help"],
				usage: "help",
			},
			category: "Info",
			cooldown: 3,
			permissions: {
				dev: false,
				client: ["SendMessages", "ViewChannel", "EmbedLinks"],
				user: [],
			},
			options: [],
		});
	}
	async callback(client: BotClient, interaction: CommandInteraction) {
		const cmdCategories: string[] = [];
		client.commands.map(c => {
			if (!cmdCategories.includes(c.category)) {
				cmdCategories.push(c.category);
			}
		});

		const menuOptionArray: APISelectMenuOption[] = [
            {
                label: "  |  MAIN",
                value: "main",
				emoji: {name: config.assets.categoryEmoji["main"]}
            }
        ];
        for(let i = 0; i < cmdCategories.length; i++){
            menuOptionArray.push({
                label: `  |  ${cmdCategories[i].toUpperCase()}`,
                value: cmdCategories[i],
				emoji: {name: config.assets.categoryEmoji[cmdCategories[i].toLowerCase()]}
            });
        }

		const select = new StringSelectMenuBuilder().setCustomId('starter').setPlaceholder('เลือกประเภทคำสั่ง').addOptions(menuOptionArray);
		const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);

		let embed = new EmbedBuilder()
			.setColor(config.assets.embed.default.color)
			.setTitle('🧭 | หน้าต่างช่วยเหลือ |')
			.addFields(
				[
					{
						name: '♻ | Github',
						value: `[Source Code](${config.assets.githubUrl})`,
						inline: true,
					},
					{
						name: '💌 | Web',
						value: `[Web Dashboard](https://erika-beta.nonlnwza.xyz)`,
						inline: true,
					},
					{
						name: '💞 | Credits',
						value: `[Nonlnwza.xyz](https://bio.nonlnwza.xyz)`,
						inline: true,
					}
				]
			)
			.setImage("https://media.discordapp.net/attachments/933667577207611402/1368857525038092339/raw.png?ex=6819bf6a&is=68186dea&hm=9d1f4d5902cbee153164b93ed255c8455030a26fedc0eeb7709720cc7cc8bd45&=&format=webp&quality=lossless&width=2616&height=1744");

		const response: InteractionResponse = await interaction.reply({
			embeds: [ embed ],
			components: [ row ],
		});

		const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 120 * 1000 });

        collector.on('collect', async i => {
            await i.deferUpdate();
            const selection = i.values[0];
            
            if(selection === "main"){ 
                return interaction.editReply({
                    embeds: [ embed ],
                });
            }

            const getCmdDataFromCategoryName = client.commands.filter(c => c.category === selection);
            const createEmbed = new EmbedBuilder()
                .setColor(config.assets.embed.default.color)
                .setTitle(`💨 | คำสั่งหมวดหมู่ **${selection.toUpperCase()}** (${getCmdDataFromCategoryName.size})`)
                .setThumbnail(client.user!.displayAvatarURL())
                .setImage("https://media.tenor.com/RfX4M6VqfRMAAAAC/rainbow-line.gif")
                .setFooter({ text: client.user!.username })
                .setTimestamp();
                
            getCmdDataFromCategoryName.forEach(c => createEmbed.addFields({ name: `\`/${c.name}\``, value: c.description?.content, inline: true } as APIEmbedField));

            interaction.editReply({
                embeds: [ createEmbed ],
            });
        });
        collector.on('end', i => {
            interaction.editReply({
                content: `❗ | คำสั่งนี้หมดเวลาการใช้งานเเล้ว หากต้องการใช้สามารถใช้ \`/help\` ได้เลยนะ`,
                embeds: [],
                components: [],
            })
            setTimeout(() => interaction.deleteReply(), 25 * 1000);
        });
	}
};
