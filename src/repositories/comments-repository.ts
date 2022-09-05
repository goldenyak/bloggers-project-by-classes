import {commentsCollection, postsCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {userType} from "../types/user-type";
import {commentsType} from "../types/comments-type";

export const commentsRepository = {
    async createComment(newComment: commentsType) {
        return await commentsCollection.insertOne(newComment)
    },

    async getCommentsByPostId(postId: string, pageNumber: number, pageSize: number) {
        return await commentsCollection.find({postId: postId})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .map(comment => {
                return {
                    id: comment._id.toString(),
                    content: comment.content,
                    userId: comment.userId,
                    userLogin: comment.userLogin,
                    addedAt: comment.addedAt
                }
            })
            .toArray()
    },

    async getCommentById(id: string) {
        const comments = await commentsCollection.aggregate([
            {
                $match: {
                    _id: new ObjectId(id)
                }
            },
            {
                $project:
                    {
                        "id": {$toString: "$_id"},
                        _id: 0,
                        "content": 1,
                        "userId": 1,
                        "userLogin": 1,
                        "addedAt": 1,
                    }
            },
        ]).toArray()

        return comments[0]
    },

    async countComments(postId: string) {
        return await commentsCollection.countDocuments({postId: postId})
    },

    async deleteComment(commentId: ObjectId) {
        return await commentsCollection.deleteOne({_id: commentId})
    },

    async updateCommentById(id: ObjectId, content: string) {
        return await commentsCollection.updateOne({_id: id}, {$set: {content: content}})
    }
}