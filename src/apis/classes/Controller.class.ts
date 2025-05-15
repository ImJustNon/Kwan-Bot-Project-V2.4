import { Application, NextFunction, Request, Response, Router } from "express"
import App from "../App";
import { BotClient } from "../../classes/Client.class";

export default abstract class Controller {
    public app: App;
    public client: BotClient;
    public express: Application;

    constructor(app: App){
        this.app = app;
        this.client = app.client;
        this.express = app.express;
    }

    // async service(req: Request, res: Response, next?: NextFunction): Promise<any>{
    //    await Promise.resolve();
    // }
}