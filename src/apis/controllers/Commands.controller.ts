import { Application, NextFunction, Request, Response } from "express";
import { BotClient } from "../../classes/Client.class";
import App from "../App";
import Controller from "../classes/Controller.class";
import { validationResult } from "express-validator";


export default class CommandsController extends Controller {
    constructor(app: App){
        super(app);
    }

    async getAll(req: Request, res: Response){
        res.json(this.client.commands);  
    }

    async getCategory(req: Request, res: Response){
        const result = validationResult(req);
        if(!result.isEmpty()) return res.status(400).json(result.array());


        if(req.query.c) return res.status(200).json(this.client.commands.filter(c => c.category.toLowerCase().includes(String(req.query.c))));
        if(req.query.n) return res.status(200).json(this.client.commands.filter(c => c.name.toLowerCase().includes(String(req.query.n))));
    }
}