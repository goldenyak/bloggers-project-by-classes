import {likesCollection} from "../db/db";


export const likesRepository = {
    async setLikeStatus(newLike: any) {
        return await likesCollection.insertOne(newLike)
    },

    async getLikes(commentId: string) {
        return await likesCollection.countDocuments({commentId: commentId})
    }
}