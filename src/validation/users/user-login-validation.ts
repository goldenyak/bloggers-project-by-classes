import {Request, Response, NextFunction} from "express";
import {container} from "../../composition-root";
import {UserServices} from "../../services/user-services";


const userServices = container.resolve(UserServices);

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