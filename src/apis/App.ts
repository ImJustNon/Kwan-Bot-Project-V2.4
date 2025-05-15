import express, { Application } from "express";
import { BotClient } from "../classes/Client.class";
import { config } from "../config/config";
import ClientRouter from "./routes/Client.route";
import UsersRouter from "./routes/Users.route";
import PublicRouter from "./routes/Public.route";

export default class App {
    public client: BotClient;
    public express: Application;
    
    constructor(client: BotClient){
        this.client = client;
        this.express = express();

        this.middlewares();
        this.routers();
    }

    private middlewares() {
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
    }

    private routers() {
        this.express.use('/api/v2/client', new ClientRouter(this).getRouter());
        this.express.use('/api/v2/users', new UsersRouter(this).getRouter());
        this.express.use('/api/v2/public', new PublicRouter(this).getRouter());
    }

    public start(){
        this.express.listen(config.api.port, (e): void => {
            if(e) return this.client.logger.error(e);
            this.client.logger.info(`API Server Started at Port : ${config.api.port}`);
        });
    }
}