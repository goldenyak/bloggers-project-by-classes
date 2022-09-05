import {ObjectId} from "mongodb";

export type RefreshTokensType = {
    _id: ObjectId,
    token: string,
    isValid: boolean,
    expiresIn: Date,
    user: string
}