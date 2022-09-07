import {Request, Response, Router} from "express";
import {commentsServices} from "../services/comments-services";
import {authMiddleware} from "../middlewares/auth-middleware";
import {body} from "express-validator";
import {inputValidation} from "../validation/errors/input-validation";
import {postsServices} from "../services/posts-services";


export const commentsRouter = Router({})

commentsRouter.get('/:id',
    async (req: Request, res: Response) => {
        const commentById = await commentsServices.getCommentById(req.params.id)
        if (commentById) {
            res.status(200).send(commentById)
            return
        } else {
            res.sendStatus(404)
            return
        }

    }
);

commentsRouter.put('/:commentId',
    authMiddleware,
    body('content').trim().notEmpty().isLength({min: 20, max: 300}),
    inputValidation,
    async (req: Request, res: Response) => {
        const commentById: any = await commentsServices.getCommentById(req.params.commentId)
        if (commentById) {
            const currentUserId = req.user!._id.toString()
            if (currentUserId === commentById.userId) {
                console.log('currentUserId === commentById.userId')
                await commentsServices.updateCommentById(req.params.commentId, req.body.content)
                res.sendStatus(204)
                return
            } else {
                res.sendStatus(403)
                return
            }
        } else {
            res.sendStatus(404)
            return
        }
    }
);

commentsRouter.delete('/:commentId',
    authMiddleware,
    async (req: Request, res: Response) => {
        const isCommentById = await commentsServices.getCommentById(req.params.commentId)

        if (isCommentById) {
            const currentUserId = req.user!._id.toString()
            // @ts-ignore
            if (currentUserId === isCommentById.userId) {
                await commentsServices.deleteComment(req.params.commentId)
                res.sendStatus(204)
                return
            } else {
                res.sendStatus(403)
                return
            }
        } else {
            res.sendStatus(404)
            return
        }
    }
);

commentsRouter.put('/:commentId/like-status',
    authMiddleware,
    body('likeStatus').isIn(['Like', 'Dislike', 'None']),
    inputValidation,
    async (req: Request, res: Response) => {
        const {likeStatus} = req.body
        const {commentId} = req.params

        if (req.user) {
            await commentsServices.setLikeStatus(commentId, likeStatus, req.user)
            res.sendStatus(204)
            return
        }
        res.sendStatus(401)
        return
    }
);