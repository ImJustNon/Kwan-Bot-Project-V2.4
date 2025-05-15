import { Application, Router } from "express"
import express from "express";
import App from "../App";
import { BotClient } from "../../classes/Client.class";

export default abstract class AppRouter {
    public app: App;
    public express: Application;
    public client: BotClient;
    public router: Router;

    constructor(app: App){
        this.router = express.Router();
        this.app = app;
        this.express = app.express;
        this.client = app.client;
    }

    public getRouter(){
        return this.router;
    }
}