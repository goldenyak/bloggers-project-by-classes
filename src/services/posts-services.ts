import {blogsRepository} from "../repositories/blogs-repository";
import {postsRepository} from "../repositories/posts-repository";
import {ObjectId} from "mongodb";
import {likesRepository} from "../repositories/likes-repository";
// import {userType} from "../types/user-type";

export const postsServices = {
    async getAllPosts(pageNumber: number, pageSize: number, bloggerId?: string) {
        const postsData = await postsRepository.getAllPosts(pageNumber, pageSize);
        return {
            pagesCount: Math.ceil(postsData[0] / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: postsData[0],
            items: postsData[1]
        }
    },

    async getPostById(id: string) {
        return await postsRepository.getPostById(id)
    },

    async createNewPost(title: string, shortDescription: string, content: string, blogId: string) {
        const blog = await blogsRepository.getBlogById(blogId)
        const newPost = {
            "_id": new ObjectId(),
            "id": Number(new Date()).toString(),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "blogId": blogId,
            "blogName": blog?.name || '',
            "addedAt": new Date(),
        }

        return await postsRepository.createNewPost(newPost)
    },

    async updatePostById(id: string, title: string, shortDescription: string, content: string, bloggerId: string) {
        const blogById = await blogsRepository.getBlogById(bloggerId)
        blogById?.name && await postsRepository.updatePostById(id, title, shortDescription, content, bloggerId, blogById?.name)
        return
    },

    async deletePostById(id: string) {
        return await postsRepository.deletePostById(id)
    },

}