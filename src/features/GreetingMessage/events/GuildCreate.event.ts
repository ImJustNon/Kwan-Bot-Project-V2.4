import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, EmbedBuilder, Guild, PermissionFlagsBits, TextChannel } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { config } from "../../../config/config";

export default class GuildCreate {
    constructor(client: BotClient){
        client.on("guildCreate", async(guild: Guild) => {
            const systemChannel = guild.channels.cache.get(guild.systemChannelId ?? "");
            const me = guild.members.me;

            if(!systemChannel) return;
            if(!me) return;
            if(!systemChannel.permissionsFor(me).has(PermissionFlagsBits.SendMessages)) return;
            
            if(systemChannel){
                const embed = new EmbedBuilder()
                    .setAuthor({name: "ขอขอบคุณที่เชิญบอท Kwan's 2 เข้าเซิฟเวอร์ของคุณน่ะคะ", iconURL: client.user?.displayAvatarURL()})
                    .setDescription(`Kwan's 2 เป็นบอทที่สามารถทำอะไรได้มากมายค่ะเช่น จัดการเซิฟเวอร์\nเกมดิสคอร์ด เพลง เเละทีเด็ด NSFW ค่ะ\nเดี๋ยวจะหาว่าของขวัญโม้ลองมาดูคำสั่งเริ่มต้นกันดีไหมค่ะ`)
                    .setColor(config.assets.embed.default.color)
                    .addFields({name: "🕹 | ดูคำสั่งทั้งหมด ", value: `\` /help \``, inline: true})
                    .setImage(config.assets.rainbowLine1)
                    .setFooter({text: client.user?.username ?? ""})
                    .setTimestamp();

                let binvite = new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('Invite')
                    .setEmoji(`🚀`)
                    .setURL(config.informations.inviteLink);
                let bsupport = new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('Support')
                    .setEmoji(`☎`)
                    .setURL(config.informations.supportLink);
                let bclose = new ButtonBuilder()
                    .setLabel(`Close`)
                    .setCustomId(`close`)
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(`🗑️`);
                let row = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(bclose, bsupport, binvite);

                const greetingMessage = await (systemChannel as TextChannel).send({
                    embeds: [ embed ],
                    components: [ row ]
                });

                const collector = greetingMessage.createMessageComponentCollector({ componentType: ComponentType.Button });
                collector.on('collect', async (b: ButtonInteraction) => {
                    if(b.customId == 'close'){
                        greetingMessage.delete();
                    } 
                    await b.deferUpdate();
                });
            }
        });
    }
}