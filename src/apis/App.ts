import express, { Application } from "express";
import { BotClient } from "../classes/Client.class";
import { config } from "../config/config";
import { HelloWorld } from "./routes/HelloWorld.route";

export default class App {
    private client: BotClient;
    private app: Application
    
    constructor(client: BotClient){
        this.client = client;
        this.app = express();

        this.middlewares();
        this.routers();
    }

    private middlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private routers() {
        this.app.use('/', new HelloWorld().getRouter());
    }

    public start(){
        this.app.listen(config.api.port, (e): void => {
            if(e) return this.client.logger.error(e);
            this.client.logger.info(`API Server Started at Port : ${config.api.port}`);
        });
    }
}