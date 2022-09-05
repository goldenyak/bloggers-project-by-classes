import jwt from "jsonwebtoken";
import {NextFunction, Request} from "express";

export const checkAuthToken = (req: Request, res: Response, next: NextFunction) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

    if (token) {
        interface JwtPayload {
            id: string
        }

        try {
            const decodedToken = jwt.verify(token, "fhdgsmmbxssnxmsnxa") as JwtPayload
            return decodedToken
        } catch (error) {
            return null
        }
    }
}