import {blogsRepository} from "../repositories/blogs-repository";
import {postsRepository} from "../repositories/posts-repository";
import {ObjectId} from "mongodb";

export const blogServices = {
    async getAllBlogs(pageNumber: number, pageSize: number, searchNameTerm: string | undefined) {
        const blogsItem = await blogsRepository.getAllBlogs(pageNumber, pageSize, searchNameTerm);
        return {
            pagesCount: Math.ceil(blogsItem[0] / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: blogsItem[0],
            items: blogsItem[1]
        }
    },

    async getBlogById(id: string) {
        return await blogsRepository.getBlogById(id)
    },

    async createNewBlog(name: string, youtubeUrl: string) {
        const newBlog = {
            "_id": new ObjectId(),
            "id": Number(new Date()).toString(),
            "name": name,
            "youtubeUrl": youtubeUrl
        }
        await blogsRepository.createNewBlog(newBlog)
        return {
            "id": newBlog.id,
            "name": newBlog.name,
            "youtubeUrl": newBlog.youtubeUrl
        }
    },

    async updateBlogById(newName: string, newYoutubeUrl: string, id: string) {
        return await blogsRepository.updateBlogById(newName, newYoutubeUrl, id)
    },

    async deleteBlogById(id: string) {
        return await blogsRepository.deleteBlogById(id)
    },

    async getBlogPosts(pageNumber: number, pageSize: number, bloggerId: string) {
        const postsData = await postsRepository.getAllPosts(pageNumber, pageSize, bloggerId)
        const pagesCount = Math.ceil(postsData[0] / pageSize)
        return {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": postsData[0],
            "items": postsData[1]
        }
    },

    async createBlogPost(title: string, shortDescription: string, content: string, blogId: string) {
        const blogById = await blogsRepository.getBlogById(blogId)
        return postsRepository.createNewPost({
            "_id": new ObjectId(),
            "id": String(new Date()),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "blogId": blogId,
            "blogName": blogById?.name || '',
            "addedAt": new Date(),
        })
    }
}