import {Request, Response, NextFunction} from "express";
import {userServices} from "../../services/user-services";

export const userEmailValidation = async (req: Request, res: Response, next:NextFunction) => {
    const userEmail = req.body.email

    if(await userServices.getUserByEmail(userEmail)) {
        res.sendStatus(400)
        return
    } else {
        next()
        return
    }
};