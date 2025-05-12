import { Router } from "express"
import express from "express";

export default abstract class AppRouter {
    public router: Router;

    constructor(){
        this.router = express.Router();
    }

    public getRouter(){
        return this.router;
    }
}