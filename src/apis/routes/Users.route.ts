import { Request, Response } from "express";
import AppRouter from "../classes/AppRouter.class";
import App from "../App";

export default class UsersRouter extends AppRouter {
    constructor(app: App){
        super(app);
        this.users();
    }

    users(){
        this.router.get("/", (req: Request, res: Response): void => {
            res.json(this.client.users.cache);
        });
    }
}