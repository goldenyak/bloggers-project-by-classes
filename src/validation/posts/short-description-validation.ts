import {body} from "express-validator";

export const shortDescriptionValidation =  body('shortDescription').trim().notEmpty().isLength({max: 100});