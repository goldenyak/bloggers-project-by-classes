import {commentsCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {commentsType} from "../types/comments-type";
import {SortDirectionEnum} from "../enums/enums";

export const commentsRepository = {
    async createComment(newComment: commentsType) {
        return await commentsCollection.insertOne({...newComment})
        // return await commentsCollection.insertOne(newComment)
    },

    async getCommentsByPostId(postId: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: SortDirectionEnum) {
        return await commentsCollection.find({postId: postId})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort(sortBy, sortDirection)
            .map(comment => {
                return {
                    id: comment.id,
                    content: comment.content,
                    userId: comment.userId,
                    userLogin: comment.userLogin,
                    createdAt: comment.createdAt
                }
            })
            .toArray()
    },

    async getCommentById(id: string) {
        const filter = {id: id}
        return await commentsCollection.findOne({id}, {projection: {_id: 0}})
    },

    async countComments(postId: string) {
        return await commentsCollection.countDocuments({postId: postId})
    },

    async deleteComment(commentId: string) {
        return await commentsCollection.deleteOne({id: commentId})
    },

    async updateCommentById(id: ObjectId, content: string) {
        return await commentsCollection.updateOne({_id: id}, {$set: {content: content}})
    }
}