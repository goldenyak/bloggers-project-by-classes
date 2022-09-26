import {body} from "express-validator";

export const youtubeUrlValidation = body('youtubeUrl').isURL()