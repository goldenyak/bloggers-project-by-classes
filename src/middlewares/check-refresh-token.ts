import {NextFunction, Request, Response} from "express";
import {authServices} from "../services/auth-services";
import {userServices} from "../services/user-services";
//
// export const checkRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
//     const refreshToken = req.cookies.refreshToken
//     const userId = refreshToken ? await authServices.checkRefreshToken(refreshToken) : false
//     if (userId) {
//         req.user = await userServices.getUserById(userId)
//         next()
//         return
//     }
//     res.sendStatus(401)
//     return
// }

export const checkRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(401)
    const user = await authServices.checkRefreshToken(refreshToken)
    if (!user) return res.sendStatus(401)
    req.user = user
    return next()

}
