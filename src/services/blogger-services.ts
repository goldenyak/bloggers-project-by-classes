import {bloggersRepository} from "../repositories/bloggers-repository";
import {postsRepository} from "../repositories/posts-repository";
import {ObjectId} from "mongodb";

export const bloggerServices = {
    async getAllBloggers(pageNumber: number, pageSize: number, searchNameTerm: string | undefined) {
        const bloggersItem = await bloggersRepository.getAllBloggers(pageNumber, pageSize, searchNameTerm);
        return {
            pagesCount: Math.ceil(bloggersItem[0] / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: bloggersItem[0],
            items: bloggersItem[1]
        }
    },

    async getBloggerById(id: string) {
        return await bloggersRepository.getBloggerById(id)
    },

    async createNewBlogger(name: string, youtubeUrl: string) {
        const newBlogger = {
            "_id": new ObjectId(),
            "id": Number(new Date()).toString(),
            "name": name,
            "youtubeUrl": youtubeUrl
        }
        await bloggersRepository.createNewBlogger(newBlogger)
        return {
            "id": newBlogger.id,
            "name": newBlogger.name,
            "youtubeUrl": newBlogger.youtubeUrl
        }
    },

    async updateBloggerById(newName: string, newYoutubeUrl: string, id: string) {
        return await bloggersRepository.updateBloggerById(newName, newYoutubeUrl, id)
    },

    async deleteBloggerById(id: string) {
        return await bloggersRepository.deleteBloggerById(id)
    },

    async getBloggerPosts(pageNumber: number, pageSize: number, bloggerId: string) {
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

    async createBloggerPost(title: string, shortDescription: string, content: string, bloggerId: string) {
        const bloggerById = await bloggersRepository.getBloggerById(bloggerId)
        return postsRepository.createNewPost({
            "_id": new ObjectId(),
            "id": String(new Date()),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "bloggerId": bloggerId,
            "bloggerName": bloggerById?.name || '',
            "addedAt": new Date(),
        })
    }
}