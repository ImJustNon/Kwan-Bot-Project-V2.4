import { Application, NextFunction, Request, Response } from "express";
import { BotClient } from "../../classes/Client.class";
import App from "../App";
import Controller from "../classes/Controller.class";
import { validationResult } from "express-validator";


export default class BotInfoController extends Controller {
    constructor(app: App){
        super(app);
    }

    async getInfo(req: Request, res: Response){
        return res.json(this.client.user);
    }
}