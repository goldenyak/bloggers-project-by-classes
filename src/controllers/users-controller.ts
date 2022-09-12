import "reflect-metadata";
import {UserServices} from "../services/user-services";
import {Request, Response} from "express";
import {injectable} from "inversify";

@injectable()
export class UserController {
    constructor(protected userServices: UserServices) {
    }

    async createUser(req: Request, res: Response) {
        const {login, password, email} = req.body
        res.status(201).json(await this.userServices.createNewUser(login, password, email))
    }

    async getAllUsers(req: Request, res: Response) {
        const pageNumber = req.query.PageNumber ? Number(req.query.PageNumber) : 1
        const pageSize = req.query.PageSize ? Number(req.query.PageSize) : 10
        res.status(200).json(await this.userServices.getAllUsers(pageNumber, pageSize))
    }

    async getUserById(req: Request, res: Response) {
        res.status(200).send(await this.userServices.getUserById(req.params.id))
        return;
    }

    async deleteUser(req: Request, res: Response) {
        await this.userServices.deleteUserById(req.params.id)
        res.sendStatus(204)
        return
    }
}