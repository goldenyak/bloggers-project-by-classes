import {NextFunction, Request, Response} from "express";
import {authServices} from "../services/auth-services";
import {container} from "../composition-root";
import {UserServices} from "../services/user-services";

const userServices = container.resolve(UserServices);

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) return res.sendStatus(401)

    const authType = req.headers.authorization.split(" ")[0].toString()
    const authPhrase: string = req.headers.authorization.split(" ")[1].toString()

    //Basic auth
    if (authType === 'Basic') {
        if (authPhrase === 'YWRtaW46cXdlcnR5') {
            next()
            return
        } else {
            res.sendStatus(401)
            return
        }
    }

    // JWT auth
    if (authType === 'Bearer') {
        const userId = await authServices.checkAuthToken(authPhrase)
        if (userId) {
            req.user = await userServices.getUserById(userId)
            return next()
        }
        return res.sendStatus(401)
    }
}
