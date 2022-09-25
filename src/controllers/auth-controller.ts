import {authServices} from "../services/auth-services";
import {Request, Response} from "express";
import {injectable} from "inversify";
import {validationResult} from "express-validator";
import {errorsAdapt} from "../utils";
import {UserServices} from "../services/user-services";

@injectable()
export class AuthController {
    constructor(protected userServices: UserServices) {
    }

    async registerUser(req: Request, res: Response) {
        const {login, password, email} = req.body
        const createdUser = await authServices.registerUser(login, password, email)
        if (createdUser) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    }

    async loginUser(req: Request, res: Response) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
            return
        }

        try {
            const {login, password} = req.body
            const findUser = await this.userServices.getUserByLogin(login)
            if (!findUser) {
                res.status(401).json("Invalid name")
                return
            }
            const isPasswordCorrect = await authServices.checkPassword(password, findUser.accountData.password)
            if (!isPasswordCorrect) {
                res.status(401).json("Invalid password")
                return
            }

            const accessToken = await authServices.createToken(login);
            const refreshToken = await authServices.createRefreshToken(login)
            return res.cookie('refreshToken', refreshToken,
                {
                    httpOnly: true,
                    secure: true
                }
            )
                .status(200).send({accessToken})

        } catch (error) {
            console.error(error)
        }
    }
}