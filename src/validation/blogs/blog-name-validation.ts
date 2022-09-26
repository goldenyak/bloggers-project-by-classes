import {body} from "express-validator";

export const blogNameValidation = body("name").notEmpty().trim().isLength({min: 1, max: 15});