import { EmbedBuilder } from "discord.js";

export default class ReplyEmbed {
    success(content: string) {
        return {
            embeds: [ 
                new EmbedBuilder()
                    .setColor("Green")
                    .setTitle(`✅ | ${content}`)
                    .setFooter({text: "Kwan's 💕 2"})
                    .setTimestamp()
                    .setThumbnail("https://media.discordapp.net/attachments/933667577207611402/1369175055115878460/182a4ba8-3faa-462c-ac59-6f6c5f2a8dc2.png?ex=681ae723&is=681995a3&hm=d9f553fe22932c3f6748ebe2c16a5764d98d1cf74c64f99831ccfeaa58c2e458&=&format=webp&quality=lossless&width=2048&height=1738")
            ]
        }
    }
    
    warn(content: string) {
        return {
            embeds: [
                new EmbedBuilder()
                    .setColor("Yellow")
                    .setTitle(`⚠️ | ${content}`)
                    .setFooter({text: "Kwan's 💕 2"})
                    .setTimestamp()
                    .setThumbnail("https://media.discordapp.net/attachments/933667577207611402/1369175056004939796/f8a8642c-b17a-4f3b-bedd-c4f5ccf4c3b2.png?ex=681ae723&is=681995a3&hm=77813f59c8dfa5b174190f5e5539c30fb65056b1e562c015dc15db920943e528&=&format=webp&quality=lossless&width=2048&height=1700")
            ]
        }
    }
    
    error(content: string) {
        return {
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setTitle(`❌ | ${content}`)
                    .setFooter({text: "Kwan's 💕 2"})
                    .setTimestamp()
                    .setThumbnail("https://media.discordapp.net/attachments/933667577207611402/1369175054453047296/14ff91e2-5b07-4218-b9fc-ab4996463980.png?ex=681ae723&is=681995a3&hm=79668e5b4ed4b3672886fb41c84aebf010f7cd296ef9e37a42b850bafef11c0c&=&format=webp&quality=lossless&width=2048&height=1720")
            ]
        }
    }
}