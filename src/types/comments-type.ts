import {ObjectId} from "mongodb";

export type commentsType = {
    "_id": ObjectId,
    "content": string,
    "userId": string,
    "userLogin": string,
    "addedAt": Date,
    "postId": string
}