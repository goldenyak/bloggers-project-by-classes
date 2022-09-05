import {Request, Response, NextFunction} from "express";
import {userServices} from "../../services/user-services";

export const userLoginValidation = async (req: Request, res: Response, next:NextFunction) => {
    const userLogin = req.body.login

    if(await userServices.getUserByLogin(userLogin)) {
        res.sendStatus(400)
        return
    } else {
        next()
        return
    }
};