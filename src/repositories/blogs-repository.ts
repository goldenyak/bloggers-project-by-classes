import {bloggersCollection} from "../db/db";
import {blogsType} from "../types/blogs-type";

export const blogsRepository = {
    async getAllBlogs(pageNumber: number, pageSize: number, searchNameTerm: string | undefined): Promise<[number, Object[]]> {

        const filter = searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'ro'}} : {};
        const countOfBlogs = await bloggersCollection.countDocuments(filter);
        const allBlogs = await bloggersCollection
            .find(filter, {projection:{ _id: 0 }})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        return [countOfBlogs, allBlogs]
    },

    async getBlogById(id: string) {
        const filter = {id: id}
        return await bloggersCollection.findOne(filter, {projection: {_id: 0}})
    },
    async createNewBlog(newBlog: blogsType) {
        try {
            await bloggersCollection.insertOne(newBlog)
            return {
                "id": newBlog.id,
                "name": newBlog.name,
                "youtubeUrl": newBlog.youtubeUrl
            }
        } catch (err) {
            console.log(err)
        }
    },
    async updateBlogById(newName: string, newYoutubeUrl: string, id: string) {

        const updatedBlog = bloggersCollection.updateOne({id: id}, {
            $set: {
                name: newName,
                youtubeUrl: newYoutubeUrl
            }
        })
        return updatedBlog
    },
    async deleteBlogById(id: string) {
        const filter = {id: id}
        const deletedBlog = await bloggersCollection.deleteOne(filter)
        return deletedBlog
    }
}