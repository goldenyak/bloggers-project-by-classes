import {ObjectId} from "mongodb";

export class User {
    constructor(
        public _id: ObjectId,
        public accountData: {
            userName: string,
            password: string,
            email: string,
            createdAt: Date,
        },
        public emailConfirmation: {
            confirmationCode: string,
            expirationDate: Date,
            isConfirmed: boolean,
        },
    ) {
    }
}
