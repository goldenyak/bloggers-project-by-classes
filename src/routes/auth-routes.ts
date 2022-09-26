import {Request, Response, Router} from "express";
// import {userServices} from "../services/user-services";
import {inputValidation} from "../validation/errors/input-validation";
import {authServices} from "../services/auth-services";
import {body, validationResult} from "express-validator";
// import {usersRepository} from "../repositories/users-repository";
import {userLoginValidation} from "../validation/users/user-login-validation";
import {userEmailValidation} from "../validation/users/user-email-validation";
import {authMiddleware} from "../middlewares/auth-middleware";
import {errorsAdapt} from "../utils";
import {checkRefreshToken} from "../middlewares/check-refresh-token";
import {isNotSpam} from "../middlewares/check-ip-middleware";
import {container} from "../composition-root";
import {UserServices} from "../services/user-services";
import {UsersRepository} from "../repositories/users-repository";
import {AuthController} from "../controllers/auth-controller";

const userServices = container.resolve(UserServices);
const userRepository = container.resolve(UsersRepository)
const authController = container.resolve(AuthController)

const registerUser = authController.registerUser.bind(authController)
const loginUser = authController.loginUser.bind(authController)


export const authRouter = Router({});

authRouter.post('/registration',
    isNotSpam('register', 10, 5),
    body('login').isLength({min: 3, max: 10}),
    body('password').isLength({min: 6, max: 20}),
    body('email').normalizeEmail().isEmail(),
    // body('email').custom(async value => {
    //     if (await userServices.getUserByEmail(value)) {
    //         return Promise.reject();
    //     }
    // }),
    body('login').custom(async value => {
        if (await userServices.getUserByLogin(value)) {
            return Promise.reject();
        }
    }),
    inputValidation,
    registerUser )

authRouter.post('/login',
    isNotSpam('login', 10, 5),
    body('login').exists().isString(),
    body('password').exists().isString(),
    loginUser
    );

authRouter.post('/refresh-token',
    checkRefreshToken,
    async (req: Request, res: Response) => {
        const userName = req.user!.accountData.userName
        const accessToken = await authServices.createToken(userName)
        const refreshToken = await authServices.createRefreshToken(userName)
        res.cookie('refreshToken', refreshToken,
            {
                httpOnly: true,
                secure: true
            }
        )
            .status(200).send({accessToken})
        return
    });

authRouter.post('/logout',
    checkRefreshToken,
    async (req: Request, res: Response) => {
        // можно удалить т.к. эта логика в checkRefreshToken (middleware)
        // await authServices.deactivateToken(req.cookies.refreshToken)
        res.sendStatus(204)
        return
    })

authRouter.get('/me',
    authMiddleware,
    (req: Request, res: Response) => {
        const user = req.user
        // console.log(user)
        res.status(200).json({
            "email": user?.accountData.email,
            "login": user?.accountData.userName,
            "userId": user?._id
        })
    })

authRouter.post('/registration-confirmation',
    isNotSpam('confirm', 10, 5),
    body('code').custom(async value => {
        const user = await userRepository.getUserByConfirmationCode(value)
        if (!user || user.emailConfirmation.isConfirmed) {
            return Promise.reject();
        }
    }),
    async (req: Request, res: Response) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
            return
        }
        await userRepository.confirmUser(req.body.code)
        res.sendStatus(204)
    });

authRouter.post('/registration-email-resending',
    isNotSpam('resend', 10, 5),
    body('email').normalizeEmail().isEmail(),
    body('email').custom(async value => {
        const user = await userServices.getUserByEmail(value)
        if (!user ) {
            return Promise.reject();
        }
        if(user.emailConfirmation.isConfirmed) {
            return Promise.reject();
        }
    }),
    async (req: Request, res: Response) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({"errorsMessages": errorsAdapt(errors.array({onlyFirstError: true}))})
            return
        }
        const user = await userServices.getUserByEmail(req.body.email)
        console.log(user)
        await authServices.updateConfirmationCode(req.body.email)
        res.sendStatus(204)
    });