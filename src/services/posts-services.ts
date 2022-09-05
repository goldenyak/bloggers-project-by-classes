import {bloggersRepository} from "../repositories/bloggers-repository";
import {postsRepository} from "../repositories/posts-repository";
import {ObjectId} from "mongodb";
import {likesRepository} from "../repositories/likes-repository";
import {userType} from "../types/user-type";

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

    async createNewPost(title: string, shortDescription: string, content: string, bloggerId: string) {
        const blogger = await bloggersRepository.getBloggerById(bloggerId)
        const newPost = {
            "_id": new ObjectId(),
            "id": Number(new Date()).toString(),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "bloggerId": bloggerId,
            "bloggerName": blogger?.name || '',
            "addedAt": new Date(),
        }

        return await postsRepository.createNewPost(newPost)
    },

    async updatePostById(id: string, title: string, shortDescription: string, content: string, bloggerId: string) {
        const bloggerById = await bloggersRepository.getBloggerById(bloggerId)
        bloggerById?.name && await postsRepository.updatePostById(id, title, shortDescription, content, bloggerId, bloggerById?.name)
        return
    },

    async deletePostById(id: string) {
        return await postsRepository.deletePostById(id)
    },

    async setLikeStatus(postId: string, likeStatus: string, user: userType) {
        const newLike = {
            "userName": user.accountData.userName,
            postId,
            "likeStatus": likeStatus
        }
        return await likesRepository.setLikeStatus(newLike)
    }

}