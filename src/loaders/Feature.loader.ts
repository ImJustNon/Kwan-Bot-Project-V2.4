import { BotClient } from "../classes/Client.class";
import path from "path";
import fs from "fs";
import { Feature } from "../classes/Feature.class";


export default class FeatureLoader {
    constructor(client: BotClient){
        const featurePath: string[] = fs.readdirSync(path.join(__dirname, "../features"));
        featurePath.forEach((dir: string) => {
            const featureFiles = fs.readdirSync(path.join(__dirname, `../features/${dir}`)).filter((fileName) => (dir === fileName.split(".")[0]) && fileName.includes(".feature"));
            try {
                import(path.join(__dirname, `../features/${featurePath}/${featureFiles[0]}`)).then(async(data) => {
                    const feat: Feature = new data.default(this, featureFiles[0]);
                    feat.callback(client);

                    client.logger.success(`Loaded Feature | ${feat.name}`);
                });
            }
            catch(e){
                console.error(`Error loading event ${featureFiles}:`, e);
            }
        });
    }
} 