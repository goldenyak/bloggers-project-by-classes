import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {errorsBundle} from "../../utils";

export const inputValidation = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({errorsMessages: errorsBundle(errors.array({onlyFirstError: true}))})
        return
    } else {
        next()
    }
}