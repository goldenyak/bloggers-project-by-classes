import {commentsRepository} from "../repositories/comments-repository";
import {commentsType} from "../types/comments-type";
import {ObjectId} from "mongodb";
import {User} from "../types/user-type";
import {likesRepository} from "../repositories/likes-repository";
import {LikesType} from "../types/likes-types";
import {SortDirectionEnum} from "../enums/enums";

export const commentsServices = {

    async getCommentById(id: string) {
        return await commentsRepository.getCommentById(id)
    },

    async getCommentsByPostId(postId: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: SortDirectionEnum) {
        const commentCount = await commentsRepository.countComments(postId)
        const pagesCount = Math.ceil(commentCount / pageSize)
        const commentsByPostId = await commentsRepository.getCommentsByPostId(postId, pageNumber, pageSize, sortBy, sortDirection)

        return {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": commentCount,
            "items": commentsByPostId
        }
    },

    async createComment(postId: string, content: string, user: User) {
        const newComment: commentsType = {
            id: Number(new Date()).toString(),
            content: content,
            userId: user._id.toString(),
            userLogin: user.accountData.userName,
            createdAt: new Date(),
            // postId: postId,
            // type: "comment"
        }
        await commentsRepository.createComment(newComment)
        if(newComment) {
            return {
                id: newComment.id,
                content: newComment.content,
                userId: newComment.userId,
                userLogin: newComment.userLogin,
                createdAt: newComment.createdAt,
            }
        }
    },

    async updateCommentById(commentId: string, content: string) {
        return await commentsRepository.updateCommentById(new ObjectId(commentId), content)
    },

    async deleteComment(commentId: string) {
        return await commentsRepository.deleteComment(commentId)
    },

    async setLikeStatus(commentId: string, likeStatus: string, user: User) {
        const newLike: LikesType = {
            "type": "comment",
            "parrentId": commentId,
            "likeStatus": likeStatus,
            "user": user.accountData.userName,
        }
        const currentLikeStatus = await likesRepository.getLikesByCommentId(commentId)

        if (!currentLikeStatus) {
            return await likesRepository.setLikeStatus(newLike)
        } else {
            return await likesRepository.updateLikeStatus(commentId, likeStatus)
        }
    }
}