import {likesCollection} from "../db/db";
import {LikesType} from "../types/likes-types";


export const likesRepository = {
    async setLikeStatus(newLike: LikesType) {
        return await likesCollection.insertOne(newLike)
    },

    async updateLikeStatus(commentId: string, likeStatus: string) {
        return await likesCollection.updateOne({parrentId: commentId}, {$set: {likeStatus: likeStatus}})
    },

    async getLikesByCommentId(commentId: string) {
        return await likesCollection.findOne({parrentId: commentId})
    },

    async getLikes(commentId: string) {
        return await likesCollection.countDocuments({commentId: commentId})
    },
}