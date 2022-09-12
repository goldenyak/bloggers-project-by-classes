import {Request, Response, NextFunction} from "express";
import {container} from "../../composition-root";
import {UserServices} from "../../services/user-services";

const userServices = container.resolve(UserServices);

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