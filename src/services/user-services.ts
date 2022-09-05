import {usersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {authServices} from "./auth-services";
import {requestBundler} from "../db/ip-adapter";

export const userServices = {
    async getAllUsers(pageNumber: number, pageSize: number) {
        const userCount = await usersRepository.countUsers({})
        const pagesCount = Math.ceil(userCount / pageSize)
        const allUsers = await usersRepository.getAllUsers(pageNumber, pageSize)

        return {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": userCount,
            "items": allUsers
        }
    },

    async createNewUser(login: string, password: string, email: string) {
        const hashPassword = await authServices.hashPassword(password)
        const newUser = await usersRepository.createNewUser({
            _id: new ObjectId(),
            accountData: {
                userName: login,
                password: hashPassword,
                email: email,
                createdAt: new Date()
            },
            emailConfirmation: {
                confirmationCode: uuidv4().toString(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false
            }
        })
        if (newUser.insertedId) {
            return {
                "id": newUser.insertedId.toString(),
                "login": login
            }
        } else return null
    },

    async getUserByLogin(login: string) {
        return await usersRepository.getUserByLogin(login)
    },

    async getUserById(id: string) {
        try {
            return await usersRepository.getUserById(new ObjectId(id))
        } catch (error) {
            return null
        }
    },

    async getUserByEmail(email: string) {
            return await usersRepository.getUserByEmail(email)
    },

    async getUserByConfirmationCode(code: string) {
        try {
            return await usersRepository.getUserByConfirmationCode(code)
        } catch (error) {
            return null
        }
    },

    async deleteUserById(id: string) {
        return await usersRepository.deleteUserById(new ObjectId(id))
    },

    updateUserConfirmationCode: async (email:string) => {
        const code = uuidv4().toString()
        await usersRepository.updateConfirmationCode(email, code)
        return code
    },

    logRequest: (requestName: string, ip: string, time: Date) => {
        const newLog = {
            requestName: requestName,
            ip: ip,
            time: time
        }
        requestBundler.push(newLog)
    },

    getRequests: (requestName: string, ip: string, time: Date) => {
        return requestBundler.filter(request =>
            request.requestName === requestName && request.ip === ip && request.time > time
        )
    }
}