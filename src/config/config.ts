import { ActivitiesOptions, ActivityType, PresenceStatus, PresenceStatusData } from "discord.js";
import dotenv from "dotenv";
import { INode } from "moonlink.js";
dotenv.config();

export type Config = {
    bot: {
        token: string;
        id: string;
        secret: string;
        presences: ActivitiesOptions[]
    };
    logs: {
        debug: boolean;
    };
    command: {
        prefix: string;
    };
    owners: string[];
    nodes: INode[];
    assets: any
}

export const config: Config = {
    bot: {
        token: process.env.BOT_TOKEN as string,
        id: process.env.BOT_CLIENT_ID as string,
        secret: process.env.BOT_CLIENT_SECRET as string,
        presences: [
            {
                name: `/help | %guild_size% เซิฟเวอร์`,
                type: ActivityType.Streaming,
                url: "https://www.twitch.tv/im_just_non"
            },
            {
                name: `v.2.4.0 | Coming Soon...`,
                type: ActivityType.Streaming,
                url: "https://www.twitch.tv/im_just_non",
            },
            {
                name: `in Development...`,
                type: ActivityType.Streaming,
                url: "https://www.twitch.tv/im_just_non",
            }
        ]
    },
    logs: {
        debug: false,
    },
    command: {
        prefix: "!"
    },
    owners: [],
    nodes: [
        {
            identifier: "Main",
            host: "88.99.215.154",
            port: 3012,
            password: "discord.gg/W2GheK3F9m",
            secure: false,
        }
    ],
    assets: {
        musicChannel: {
            bannerUrl: "https://cdn.discordapp.com/attachments/887363452304261140/964713073527099392/standard_4.gif?ex=665b2f50&is=6659ddd0&hm=b9f715b410612b4aac080989b99a01867fd5a46ac001fd6da67792e9271592f8&",
            defaultUrl: "https://cdn.discordapp.com/attachments/887363452304261140/964737487383711764/standard_7.gif?ex=665b460c&is=6659f48c&hm=ac22a8fc9f43f1f3a6c5a334d8badf877b01b5349dc0820df1a4e6548f9017c8&",
            defaultColor: "White"
        }
    }
}