import {ObjectId} from "mongodb";

export type bloggersType = {
    "_id": ObjectId,
    "id": string,
    "name": string,
    "youtubeUrl": string
}