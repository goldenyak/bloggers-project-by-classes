import {NextFunction, Request, Response} from "express";
import sub from "date-fns/sub";
import {container} from "../composition-root";
import {UserServices} from "../services/user-services";

const userServices = container.resolve(UserServices);

export const isNotSpam = (requestName: string, timeLimit: number = 10, attemptsLimit: number = 5) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const logs = userServices.getRequests(requestName, req.ip, sub(new Date(), {seconds: timeLimit}))
        if (!logs || logs.length < attemptsLimit) {
            userServices.logRequest(requestName, req.ip, new Date())
            next()
            return
        } else {
            res.sendStatus(429)
            return
        }
    }
}