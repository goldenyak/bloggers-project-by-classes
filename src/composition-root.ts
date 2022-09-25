import {UsersRepository} from "./repositories/users-repository";
import {UserServices} from "./services/user-services";
import {UserController} from "./controllers/users-controller";
import {Container} from "inversify";
import {AuthController} from "./controllers/auth-controller";

// export const userRepository = new UsersRepository();
// export const userServices = new UserServices(userRepository)
// export const userController = new UserController(userServices)

export const container = new Container();
container.bind<UserController>(UserController).to(UserController)
container.bind<UserServices>(UserServices).to(UserServices)
container.bind<UsersRepository>(UsersRepository).to(UsersRepository)
container.bind<AuthController>(AuthController).to(AuthController)
