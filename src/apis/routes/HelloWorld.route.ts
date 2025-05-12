import { Request, Response } from "express";
import AppRouter from "../classes/AppRouter.class";

export class HelloWorld extends AppRouter {
    constructor(){
        super();
        this.helloworld();
    }

    helloworld(){
        this.router.get("/", (req: Request, res: Response): void => {
            res.send("Hello World");
        });
    }
}