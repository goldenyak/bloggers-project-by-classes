import {RefreshTokensType} from "../types/refresh-tokens-type";
import {refreshTokensCollection} from "../db/db";

export const tokensRepository = {
    async addNewRefreshToken(newToken: RefreshTokensType) {
        return await refreshTokensCollection.insertOne(newToken)
    },

    async getToken(refreshToken: string) {
        return await refreshTokensCollection.findOne({token: refreshToken})
    },

    async deactivateToken(refreshToken: string) {
        return await refreshTokensCollection.updateOne({token: refreshToken}, {$set: {isValid: false}})
    }

}