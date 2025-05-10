import { ActionRowBuilder, AnyComponentBuilder, APIEmbedField, APIMessageComponentEmoji, APISelectMenuOption, ApplicationCommandOptionType, CacheType, ChannelType, ChatInputCommandInteraction, Collection, CommandInteraction, ComponentType, EmbedBuilder, Guild, GuildMember, Interaction, InteractionCallbackResponse, InteractionResponse, MessageFlags, RestOrArray, SlashCommandStringOption, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { BotClient } from "../../classes/Client.class";
import { Command } from "../../classes/Command.class";
import { config } from "../../config/config";
import axios from "axios";
import ReplyEmbed from "../../utils/ReplyEmbed.util";

export default class AutoRolesAdd extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: "autoroles-add",
            description: {
                content: "Add Roles to new member when joined",
                examples: [""],
                usage: "",
            },
            category: "AutoRoles",
            cooldown: 3,
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks", "ManageRoles"],
                user: ["Administrator"],
            },
            options: [
                {
                    name: "voice-channel",
                    description: `เลือกช่องเสียงที่ต้องการตั้งค่า`,
                    type: ApplicationCommandOptionType.Role,
                    required: true,
                },
            ],
        });
    }
    async callback(client: BotClient, interaction: ChatInputCommandInteraction): Promise<any>{
    

    }
};
