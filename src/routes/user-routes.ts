import "reflect-metadata";
import {Router} from "express";
import {body} from "express-validator";
import {authMiddleware} from "../middlewares/auth-middleware";
import {inputValidation} from "../validation/errors/input-validation";
import {userIdValidation} from "../validation/users/user-id-validation";
import {container} from "../composition-root";
import {UserController} from "../controllers/users-controller";


const userController = container.resolve(UserController)
export const userRouter = Router({});

const createUser =  userController.createUser.bind(userController)
const getAllUsers = userController.getAllUsers.bind(userController)
const getUserById = userController.getUserById.bind(userController)
const deleteUser = userController.deleteUser.bind(userController)

userRouter.post('/',
    authMiddleware,
    body('login').isLength({min: 3, max: 10}),
    body('password').isLength({min: 6, max: 20}),
    inputValidation,
    createUser)
userRouter.get('/', getAllUsers)
userRouter.get('/:id', userIdValidation, getUserById)
userRouter.delete('/:id',
    authMiddleware,
    userIdValidation,
    inputValidation,
    deleteUser)
