import {NextFunction, Request, Response} from "express";
import {postsCollection} from "../../db/db";
import {postsServices} from "../../services/posts-services";
import {blogsRepository} from "../../repositories/blogs-repository";
import {postsRepository} from "../../repositories/posts-repository";


export const postIdValidation = async (req: Request, res: Response, next: NextFunction) => {

    const postId = req.params.postId || req.params.id || null
    const exist = postId ? await postsServices.getPostById(postId) : null
    if (!exist) {
        res.status(404)
        res.end()
        return
    } else next()
};