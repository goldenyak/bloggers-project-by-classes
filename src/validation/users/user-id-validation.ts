import {Request, Response, NextFunction} from "express";
import {userServices} from "../../services/user-services";

export const userIdValidation = async (req: Request, res: Response, next:NextFunction) => {
    const userId = req.params.id || null

    if(userId && !await userServices.getUserById(userId)) {
        res.sendStatus(404)
        return
    } else {
        next()
        return
    }
};