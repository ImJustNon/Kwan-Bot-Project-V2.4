import { ActivitiesOptions, ActivityType, PresenceStatus, PresenceStatusData } from "discord.js";
import dotenv from "dotenv";
import { INode } from "moonlink.js";
import { assets, AssetsConfig } from "./assets.config";
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
    };
    owners: string[];
    nodes: INode[];
    assets: AssetsConfig
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
    },
    owners: ["708965153131200594"],
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
        ...assets
    }
}