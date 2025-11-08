import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, DMChannel, EmbedBuilder, Guild, GuildMember, Message, PermissionFlagsBits, Role, TextChannel } from "discord.js";
import { BotClient } from "../../../classes/Client.class";
import { config } from "../../../config/config";
import { Captcha, CaptchaGenerator } from "captcha-canvas";
import { GuildCaptcha, SchemaInterface as IGuildCaptcha } from "../../../models/GuildCaptcha.model";

export default class GuildMemberAdd {
    private client: BotClient;
    constructor(client: BotClient){
        this.client = client;

        client.on("guildMemberAdd", async(member: GuildMember) => {
            if(member.user.bot) return;

            // check activation
            const findCapchaSetup = await GuildCaptcha.findOne({
                guild_id: member.guild.id,
            });
            if(!findCapchaSetup) return;


            const captcha: Captcha = new Captcha();
            captcha.async = true;
            captcha.addDecoy();
            captcha.drawTrace();
            captcha.drawCaptcha();


            const attachment = new AttachmentBuilder(await captcha.png, {
                name: `captcha.png`
            });

            const embed = new EmbedBuilder()
                .setColor("White")
                .setDescription(`โปรดพิมพ์สิ่งที่คุณเห็นในภาพนี้เพื่อยืนยันตัวตน\nโดย \`มีเวลา ${String(findCapchaSetup.timeout / 1000)} วินาที\` ในการยืนยันค่ะ`)
                .setImage('attachment://captcha.png')
                .setFooter({text: "Kwan's 💕 2"})
                .setTimestamp()

            const dm = await member.send({
                embeds: [embed],
                files: [attachment]
            });


            const filter = async(message: any) => {
                if (message.author.id !== member.id) return false;
                if (message.content === captcha.text) return true;

                await member.send(':x: การยืนยันตัวตนผิดพลาด โปรดลองอีกครั้งค่ะ');
                return false;
            };


            try{
                const collected = await (dm.channel as DMChannel).awaitMessages({
                    filter,
                    max: 1,
                    time: findCapchaSetup.timeout,
                    errors: ['time']
                });
                if(collected.size <= 0) throw new Error;

                await member.send(':white_check_mark: การยืนยันตัวตนถูกต้องค่ะ!');

                await this.addNewRole(findCapchaSetup, member);
                await this.removeNewRole(findCapchaSetup, member);
            }
            catch(e){
                await member.send(':warning: เนื่องจากคุณหมดเวลาในการยืนยันตัวตนเเล้ว จำเป็นต้องเตะคุณออกจากเซิฟเวอร์นี้ค่ะ');
                await member.kick('หมดเวลายืนยันตัวตน');
            }

        });
    }

    private async addNewRole(db: IGuildCaptcha, m: GuildMember): Promise<void>{
        // Role add
        if(!db.role_new_id) return;

        const checkrole = m.guild.roles.cache.find(r => r.id === db.role_new_id);
        if(!checkrole) return;

        const me = m.guild.members.cache.get(this.client.user?.id ?? "") as GuildMember;

        // if bot doest have permission enough
        if(me.roles.highest.position < checkrole?.rawPosition) return;

        // in case user already has
        if(m.roles.cache.has(checkrole.id)) return;

        await m.roles.add(checkrole.id);
        await m.send(`:inbox_tray: ได้ทำการเพิ่มยศ ${checkrole.name} ให้เรียบร้อยค่ะ`);
    }

    private async removeNewRole(db: IGuildCaptcha, m: GuildMember): Promise<void>{
        // Role remove
        if(!db.role_old_id) return;

        const checkrole = m.guild.roles.cache.find(r => r.id === db.role_old_id);
        if(!checkrole) return;

        const me = m.guild.members.cache.get(this.client.user?.id ?? "") as GuildMember;

        // if bot doest have permission enough
        if(me.roles.highest.position < checkrole.rawPosition) return;

        // in case if user doest has
        if(!m.roles.cache.has(checkrole.id)) return;
        

        await m.roles.remove(checkrole.id);
        await m.send(`:outbox_tray: ได้ทำการนำยศ ${checkrole.name} ออกเรียบร้อยค่ะ`);
    }
}