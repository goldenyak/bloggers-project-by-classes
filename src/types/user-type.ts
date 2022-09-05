import {ObjectId} from "mongodb";

export type userType = {
    "_id": ObjectId,
    "accountData": {
        "userName": string,
        "password": string,
        "email": string,
        "createdAt": Date,
    }
    "emailConfirmation": {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean,
    }
}