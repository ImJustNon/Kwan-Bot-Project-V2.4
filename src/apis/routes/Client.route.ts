import { Request, Response } from "express";
import AppRouter from "../classes/AppRouter.class";
import App from "../App";

export default class ClientRouter extends AppRouter {
    constructor(app: App){
        super(app);
        this.info();
    }

    info(){
        this.router.get("/info", (req: Request, res: Response): void => {
            res.json(this.client.user);
        });
    }
}