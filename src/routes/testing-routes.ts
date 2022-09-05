import {Request, Response, Router} from "express";
import {
    bloggersCollection,
    commentsCollection,
    postsCollection, refreshTokensCollection,
    usersCollection
} from "../db/db";


export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await bloggersCollection.deleteMany({})
    await postsCollection.deleteMany({})
    await usersCollection.deleteMany({})
    await commentsCollection.deleteMany({})
    await refreshTokensCollection.deleteMany({})
    res.sendStatus(204)
    return
})