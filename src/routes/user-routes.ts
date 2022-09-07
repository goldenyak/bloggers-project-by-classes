import {Request, Response, Router} from "express";
import {userServices} from "../services/user-services";
import {body} from "express-validator";
import {authMiddleware} from "../middlewares/auth-middleware";
import {inputValidation} from "../validation/errors/input-validation";
import {userIdValidation} from "../validation/users/user-id-validation";


export const userRouter = Router({});

class UserController {
    async createUser(req: Request, res: Response) {
        const {login, password, email} = req.body
        res.status(201).json(await userServices.createNewUser(login, password, email))
    }

    async getAllUsers(req: Request, res: Response) {
        const pageNumber = req.query.PageNumber ? Number(req.query.PageNumber) : 1
        const pageSize = req.query.PageSize ? Number(req.query.PageSize) : 10
        res.status(200).json(await userServices.getAllUsers(pageNumber, pageSize))
    }

    async getUserById(req: Request, res: Response) {
        res.status(200).send(await userServices.getUserById(req.params.id))
        return;
    }

    async deleteUser(req: Request, res: Response) {
        await userServices.deleteUserById(req.params.id)
        res.sendStatus(204)
        return
    }
}

export const usersController = new UserController();

userRouter.get('/', usersController.getAllUsers);
userRouter.get('/:id',
    userIdValidation,
    usersController.getUserById
);
userRouter.post('/',
    authMiddleware,
    body('login').isLength({min: 3, max: 10}),
    body('password').isLength({min: 6, max: 20}),
    // body('email').normalizeEmail().isEmail(),
    inputValidation,
    usersController.createUser
);

userRouter.delete('/:id',
    authMiddleware,
    userIdValidation,
    inputValidation,
    usersController.deleteUser
);