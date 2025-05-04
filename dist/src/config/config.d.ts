import { ActivitiesOptions } from "discord.js";
import { INode } from "moonlink.js";
export type Config = {
    bot: {
        token: string;
        id: string;
        secret: string;
        presences: ActivitiesOptions[];
    };
    logs: {
        debug: boolean;
    };
    command: {
        prefix: string;
    };
    owners: string[];
    nodes: INode[];
    assets: any;
};
export declare const config: Config;
