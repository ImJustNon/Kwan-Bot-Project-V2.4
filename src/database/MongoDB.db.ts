import { BotClient } from "../classes/Client.class";

export default class MongoDB {
    client: BotClient;

    constructor(client: BotClient){
        this.client = client;
        this.connect();
    }

    private async connect(){
        try {
            await this.client.mongoose.connect(process.env.DATABASE_MONGODB_URL ?? "").then(() => {
                this.client.logger.info("Connected to MongoDB");
            });
        }
        catch(e){
            return this.client.logger.error(e);
        }
    }
        
} 