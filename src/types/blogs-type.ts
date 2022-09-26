import {ObjectId} from "mongodb";

export type blogsType = {
    "_id": ObjectId,
    "id": string,
    "name": string,
    "youtubeUrl": string
}