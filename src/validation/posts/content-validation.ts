import {body} from "express-validator";

export const contentValidation = body('content').trim().isLength({min: 1, max: 1000});