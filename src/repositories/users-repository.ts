import {usersCollection} from "../db/db";
import {userType} from "../types/user-type";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async getAllUsers(pageNumber: number, pageSize: number) {

        const users = await usersCollection.find({}, {
            projection: {
                _id: 1,
                accountData: 1
            }
        })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        return users.map(user => {
            return {
                id: user._id.toString(), login: user.accountData.userName
            }
        })
    },

    async createNewUser(newUser: userType) {
        return await usersCollection.insertOne(newUser)
    },

    async getUserByLogin(login: string) {
        return await usersCollection.findOne({"accountData.userName": login})
    },

    async getUserById(id: ObjectId) {
            return await usersCollection.findOne({_id: id});
    },

    async getUserByEmail(email: string) {
        return await usersCollection.findOne({"accountData.email": email});
    },

    async getUserByConfirmationCode(code: string) {
        return await usersCollection.findOne({"emailConfirmation.confirmationCode": code});
    },

    async deleteUserById(id: ObjectId) {
        return await usersCollection.deleteOne({_id: id});
    },

    // async updateConfirmation(_id: ObjectId) {
    //     const result = await usersCollection.updateOne({_id}, {$set: {"emailConfirmation.isConfirmed": true}})
    //     return result.modifiedCount === 1
    // },

    updateConfirmationCode: async (email: string, code: string) => {
        return await usersCollection.updateOne({"accountData.email": email}, {$set: {"emailConfirmation.confirmationCode": code}})
    },

    confirmUser: async (code:string) => {
        return await usersCollection.updateOne({"emailConfirmation.confirmationCode": code},{$set: {"emailConfirmation.isConfirmed": true}});
    },

    async countUsers(filter: Object) {
        return await usersCollection.countDocuments(filter)
    }
}