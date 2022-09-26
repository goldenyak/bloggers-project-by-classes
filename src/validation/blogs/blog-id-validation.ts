import {NextFunction, Request, Response} from "express";
import {bloggersCollection} from "../../db/db";
import {blogsRepository} from "../../repositories/blogs-repository";

export const blogIdValidation =  async (req: Request, res: Response, next: NextFunction) => {

    const blogId = req.params.blogId || req.params.id ||  null
    if(blogId && !await blogsRepository.getBlogById(blogId)) {
        res.sendStatus(404)
        return
    } else next()

    return
};