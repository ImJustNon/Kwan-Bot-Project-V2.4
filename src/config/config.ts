import { ActivitiesOptions, ActivityType, PresenceStatus, PresenceStatusData } from "discord.js";
import dotenv from "dotenv";
import { INode } from "moonlink.js";
dotenv.config();

export type Config = {
    bot: {
        token: string;
        id: string;
        secret: string;
        status: {
            status: PresenceStatusData,
            activity: string,
            activityType: ActivityType
        }
    };
    command: {
        prefix: string;
    };
    owners: string[];
    nodes: INode[]
}

export const config: Config = {
    bot: {
        token: process.env.BOT_TOKEN as string,
        id: process.env.BOT_CLIENT_ID as string,
        secret: process.env.BOT_CLIENT_SECRET as string,
        status: {
            status: "online",
            activity: "asd",
            activityType: 2
        }
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
    ]
}