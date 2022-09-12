import {Request, Response, NextFunction} from "express";
import {container} from "../../composition-root";
import {UserServices} from "../../services/user-services";

const userServices = container.resolve(UserServices);

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