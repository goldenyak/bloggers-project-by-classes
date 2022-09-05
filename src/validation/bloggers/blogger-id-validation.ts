import {NextFunction, Request, Response} from "express";
import {bloggersCollection} from "../../db/db";
import {bloggersRepository} from "../../repositories/bloggers-repository";

export const bloggerIdValidation =  async (req: Request, res: Response, next: NextFunction) => {

    const bloggerId = req.params.bloggerId || req.params.id ||  null
    if(bloggerId && !await bloggersRepository.getBloggerById(bloggerId)) {
        res.sendStatus(404)
        return
    } else next()

    return
};