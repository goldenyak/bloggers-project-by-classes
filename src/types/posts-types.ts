import {ObjectId, WithId} from "mongodb";
//
// export interface postInterface extends WithId<Document>{
//     "_id": ObjectId,
//     "id": string,
//     "title": string,
//     "shortDescription": string,
//     "content": string,
//     "bloggerId": number,
//     "bloggerName": string
// }

export type postsType = {
    "_id": ObjectId,
    "id": string,
    "title": string,
    "shortDescription": string,
    "content": string,
    "bloggerId": string,
    "bloggerName": string,
    "addedAt": Date,
}