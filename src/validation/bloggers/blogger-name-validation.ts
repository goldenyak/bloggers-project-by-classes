import {body} from "express-validator";

export const bloggerNameValidation = body("name").notEmpty().trim().isLength({min: 1, max: 15});