import { APIMessageComponentEmoji, ColorResolvable } from "discord.js";

export type AssetsConfig = {
    categoryEmoji: Record<string, string>;
    musicChannel: {
        bannerUrl: string;
        defaultUrl: string;
        defaultColor: ColorResolvable;
    };
    githubUrl: string;
    embed: {
        default: {
            color: ColorResolvable;
        }
    }
}

export const assets: AssetsConfig = {
    categoryEmoji: {
        "main": "🏡",
        "info": "ℹ️",
        "music": "🎵",
        "musicchannel": "🎤",
        "autovoicechannel": "🎙️",
        "config": "⚙️"
    },
    musicChannel: {
        bannerUrl: "https://cdn.discordapp.com/attachments/887363452304261140/964713073527099392/standard_4.gif?ex=665b2f50&is=6659ddd0&hm=b9f715b410612b4aac080989b99a01867fd5a46ac001fd6da67792e9271592f8&",
        defaultUrl: "https://cdn.discordapp.com/attachments/887363452304261140/964737487383711764/standard_7.gif?ex=665b460c&is=6659f48c&hm=ac22a8fc9f43f1f3a6c5a334d8badf877b01b5349dc0820df1a4e6548f9017c8&",
        defaultColor: "White"
    },
    githubUrl: "https://github.com/ImJustNon/Kwan-Bot-Project-V2.4",
    embed: {
        default: {
            color: "White"
        }
    }
}