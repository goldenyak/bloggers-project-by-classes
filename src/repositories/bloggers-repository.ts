import {bloggersCollection} from "../db/db";
import {bloggersType} from "../types/bloggers-type";

export const bloggersRepository = {
    async getAllBloggers(pageNumber: number, pageSize: number, searchNameTerm: string | undefined): Promise<[number, Object[]]> {

        const filter = searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'ro'}} : {};
        const countOfBloggers = await bloggersCollection.countDocuments(filter);
        const allBloggers = await bloggersCollection
            .find(filter, {projection:{ _id: 0 }})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        return [countOfBloggers, allBloggers]
    },

    async getBloggerById(id: string) {
        const filter = {id: id}
        return await bloggersCollection.findOne(filter, {projection: {_id: 0}})
    },
    async createNewBlogger(newBlogger: bloggersType) {
        try {
            await bloggersCollection.insertOne(newBlogger)
            return {
                "id": newBlogger.id,
                "name": newBlogger.name,
                "youtubeUrl": newBlogger.youtubeUrl
            }
        } catch (err) {
            console.log(err)
        }
    },
    async updateBloggerById(newName: string, newYoutubeUrl: string, id: string) {

        const updatedBlogger = bloggersCollection.updateOne({id: id}, {
            $set: {
                name: newName,
                youtubeUrl: newYoutubeUrl
            }
        })
        return updatedBlogger
    },
    async deleteBloggerById(id: string) {
        const filter = {id: id}
        const deletedBlogger = await bloggersCollection.deleteOne(filter)
        return deletedBlogger
    }
}