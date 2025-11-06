import { EmbedBuilder, GuildMember, Role } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import ReplyEmbed from "../../../utils/ReplyEmbed.util";
import { GuildAutoRoles } from "../../../models/GuildAutoRoles.model";

export default class GuildMemberAdd {
    constructor(client: BotClient){
        client.on("guildMemberAdd", async(member: GuildMember) => {
            try {
                // const findGuildAutoRoles = await client.prisma.guildAutoRoles.findMany({
                //     where: {
                //         guild_id: member.guild.id
                //     },
                //     select: {
                //         role_id: true
                //     }
                // });
                const findGuildAutoRoles = await GuildAutoRoles.find({
                    guild_id: member.guild.id
                });

                if(!findGuildAutoRoles || findGuildAutoRoles.length === 0) return;

                const roles: Role[] = [];
                for(const role of findGuildAutoRoles){
                    const fetchRole = member.guild.roles.cache.get(role.role_id);
                    if(!fetchRole) continue;
                    roles.push(fetchRole);
                }

                await member.roles.add(roles).then(async() => {
                    await member.send(new ReplyEmbed().success(`เพิ่มยศ \`${roles.map(r => r.name).join(", ")}\` ให้เเล้วนะคะ`)).then((m) => m.react("👌")).catch(e => {});
                }).catch(e => {});
            }
            catch(e){}
        }); 
    }
}