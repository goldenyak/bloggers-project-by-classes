import {Request, Response, Router} from 'express'
import {authMiddleware} from "../middlewares/auth-middleware";
import {youtubeUrlValidation} from "../validation/blogs/youtube-url-validation";
import {blogNameValidation} from "../validation/blogs/blog-name-validation";
import {blogIdValidation} from "../validation/blogs/blog-id-validation";
import {inputValidation} from "../validation/errors/input-validation";
import {blogServices} from "../services/blog-services";
import {param, query} from "express-validator";
import {titleValidation} from "../validation/posts/title-validation";
import {shortDescriptionValidation} from "../validation/posts/short-description-validation";
import {contentValidation} from "../validation/posts/content-validation";

export const blogsRouter = Router({})

blogsRouter.get('/',
    query('PageNumber').isInt().optional({checkFalsy: true}),
    query('PageSize').isInt().optional({checkFalsy: true}),
    inputValidation,
    async (req: Request, res: Response) => {

        const searchNameTerm = req.query.SearchNameTerm?.toString()
        const PageNumber = req.query.PageNumber ? Number(req.query.PageNumber) : 1
        const PageSize = req.query.PageSize ? Number(req.query.PageSize) : 10

        const blogs = await blogServices.getAllBlogs(PageNumber, PageSize, searchNameTerm)
        res.status(200).send(blogs)
        return;
    });
blogsRouter.get('/:id',
    blogIdValidation,
    async (req: Request, res: Response) => {
        res.status(200).send(await blogServices.getBlogById(req.params.id))
        return
})
blogsRouter.post('/',
    authMiddleware,
    blogNameValidation,
    youtubeUrlValidation,
    inputValidation,
    async (req: Request, res: Response) => {
        const {name, youtubeUrl} = req.body

        const newBlog = await blogServices.createNewBlog(name, youtubeUrl)
        res.status(201).send(newBlog)
        return
    })

blogsRouter.put('/:id', authMiddleware, blogIdValidation, youtubeUrlValidation, blogNameValidation, inputValidation, async (req: Request, res: Response) => {
    const {name, youtubeUrl} = req.body
    const {id} = req.params

    const updatedBlog = await blogServices.updateBlogById(name, youtubeUrl, id)
    updatedBlog && res.sendStatus(204)
    return;
})
blogsRouter.delete('/:id', authMiddleware, blogIdValidation, async (req: Request, res: Response) => {
    await blogServices.deleteBlogById(req.params.id)
    res.sendStatus(204)
    return;
})
blogsRouter.get('/:blogId/posts',
    blogIdValidation,
    param('blogId').isInt(),
    query('PageNumber').isInt().optional({checkFalsy: true}),
    query('PageSize').isInt().optional({checkFalsy: true}),
    async (req: Request, res: Response) => {
        const pageNumber = req.query.PageNumber ? Number(req.query.PageNumber) : 1
        const pageSize = req.query.PageSize ? Number(req.query.PageSize) : 10

        res.status(200).send(await blogServices.getBlogPosts(pageNumber, pageSize, req.params.bloggerId))
        return
    })

blogsRouter.post('/:blogId/posts',
    authMiddleware,
    blogIdValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidation,
    param('blogId').isInt(),
    async (req: Request, res: Response) => {
        const {title, shortDescription, content} = req.body

        res.status(201).send(await blogServices.createBlogPost(title, shortDescription, content, req.params.blogId))

        return
    })