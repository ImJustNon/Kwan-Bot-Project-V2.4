import { Request, Response } from "express";
import AppRouter from "../classes/AppRouter.class";
import App from "../App";
import CommandsController from "../controllers/Commands.controller";
import { oneOf, query } from "express-validator";
import BotInfoController from "../controllers/BotInfo.controller";

export default class PublicRouter extends AppRouter {
    private commandsController: CommandsController;
    private botInfoController: BotInfoController;
    
    constructor(app: App){
        super(app);
        this.commandsController = new CommandsController(app);
        this.botInfoController = new BotInfoController(app);
        this.routers();
    }

    routers(){
        this.router.get("/commands",
            (req: Request, res: Response) => this.commandsController.getAll(req, res)
        );
        this.router.get("/commands/find", 
            oneOf([
                query('n').exists().withMessage('Either "n" or "c" query param must be provided'),
                query('c').exists().withMessage('Either "n" or "c" query param must be provided'),
            ]),
            (req: Request, res: Response): any => this.commandsController.getCategory(req, res)
        );

        this.router.get("/bot/info", 
            (req: Request, res: Response): any => this.botInfoController.getInfo(req, res)
        );
    }
}