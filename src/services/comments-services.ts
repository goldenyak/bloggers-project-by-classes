import {commentsRepository} from "../repositories/comments-repository";
import {commentsType} from "../types/comments-type";
import {ObjectId} from "mongodb";
import {userType} from "../types/user-type";
import {likesRepository} from "../repositories/likes-repository";

export const commentsServices = {

    async getCommentById(id: string) {
        const commentById = await commentsRepository.getCommentById(id)
        const likesCount = await likesRepository.getLikes(id)
        if (commentById) {
            return ({
                ...commentById,
                "likesInfo": {
                    "likesCount": likesCount,
                    "dislikesCount": 0,
                    "myStatus": "None"
                }
            })
        } else return null
    },

    async getCommentsByPostId(postId: string, pageNumber: number, pageSize: number) {
        const commentCount = await commentsRepository.countComments(postId)
        const pagesCount = Math.ceil(commentCount / pageSize)
        const commentsByPostId = await commentsRepository.getCommentsByPostId(postId, pageNumber, pageSize)

        return {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": commentCount,
            "items": commentsByPostId
        }
    },

    async createComment(postId: string, content: string, user: userType) {
        const newComment: commentsType = {
            _id: new ObjectId(),
            content: content,
            userId: user._id.toString(),
            userLogin: user.accountData.userName,
            addedAt: new Date(),
            postId: postId
        }
        const result = await commentsRepository.createComment(newComment)
        if (result.acknowledged) {
            return {
                id: result.insertedId,
                content: newComment.content,
                userId: newComment.userId,
                userLogin: newComment.userLogin,
                addedAt: newComment.addedAt,
            }
        } else {
            throw new Error('Comment posting failed')
        }
    },

    // async createComment(postId: string, content: string, user: userType) {
    //     const newComment = {
    //         "_id": new ObjectId(),
    //         "id": Number(new Date()).toString(),
    //         "content": content,
    //         "userId": user._id.toString(),
    //         "userLogin": user.accountData.userName,
    //         "addedAt": new Date(),
    //         "postId": postId
    //     }
    //     return await commentsRepository.createComment(newComment)
    // },

    async updateCommentById(commentId: string, content: string) {
        return await commentsRepository.updateCommentById(new ObjectId(commentId), content)
    },

    async deleteComment(commentId: string) {
        return await commentsRepository.deleteComment(new ObjectId(commentId))
    },

    async setLikeStatus(commentId: string, likeStatus: string, user: userType) {
        const newLike = {
            "userName": user.accountData.userName,
            commentId,
            "likeStatus": likeStatus
        }
        return await likesRepository.setLikeStatus(newLike)
    }
}