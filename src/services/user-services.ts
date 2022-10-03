import "reflect-metadata";
import {UsersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {authServices} from "./auth-services";
import {requestBundler} from "../db/ip-adapter";
import {User} from "../types/user-type";
import {injectable} from "inversify";

@injectable()
export class UserServices {
    constructor(protected userRepository: UsersRepository) {}

    async getAllUsers(pageNumber: number, pageSize: number) {
        const userCount = await this.userRepository.countUsers({})
        const pagesCount = Math.ceil(userCount / pageSize)
        const allUsers = await this.userRepository.getAllUsers(pageNumber, pageSize)

        return {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": userCount,
            "items": allUsers
        }
    }

    async createNewUser(login: string, password: string, email: string) {
        const hashPassword = await authServices.hashPassword(password)
        const user: User = new User(
            new ObjectId(),
            {
                userName: login,
                password: hashPassword,
                email: email,
                createdAt: new Date()
            },
            {
                confirmationCode: uuidv4().toString(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false
            })

        await this.userRepository.createNewUser(user)
        if (user) {
            return {
                id: user._id,
                login: user.accountData.userName,
                email: user.accountData.email,
                createdAt: user.accountData.createdAt
            }
        } else return null
    }

    async getUserByLogin(login: string) {
        return await this.userRepository.getUserByLogin(login)
    }

    async getUserById(id: string) {
        try {
            return await this.userRepository.getUserById(new ObjectId(id))
        } catch (error) {
            return null
        }
    }

    async getUserByEmail(email: string) {
        return await this.userRepository.getUserByEmail(email)
    }

    async getUserByConfirmationCode(code: string) {
        try {
            return await this.userRepository.getUserByConfirmationCode(code)
        } catch (error) {
            return null
        }
    }

    async deleteUserById(id: string) {
        return await this.userRepository.deleteUserById(new ObjectId(id))
    }

    async updateUserConfirmationCode(email: string) {
        const code = uuidv4().toString()
        await this.userRepository.updateConfirmationCode(email, code)
        return code
    }

    logRequest(requestName: string, ip: string, time: Date) {
        const newLog = {
            requestName: requestName,
            ip: ip,
            time: time
        }
        requestBundler.push(newLog)
    }

    getRequests(requestName: string, ip: string, time: Date) {
        return requestBundler.filter(request =>
            request.requestName === requestName && request.ip === ip && request.time > time
        )
    }
}
