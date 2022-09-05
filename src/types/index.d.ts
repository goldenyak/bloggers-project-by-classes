import {userType} from "./user-type";

declare global {
    declare namespace Express {
        export interface Request {
            user: userType | null
        }
    }
}