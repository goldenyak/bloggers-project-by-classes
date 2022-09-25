import express, {Request, Response} from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import {bloggersRouter} from "./routes/bloggers-routes";
import {postsRouter} from "./routes/posts-routes";
import {runDb} from "./db/db";
import {authRouter} from "./routes/auth-routes";
import {userRouter} from "./routes/user-routes";
import {commentsRouter} from "./routes/comments-routes";
import {emailRouter} from "./routes/email-routes";
import {testingRouter} from "./routes/testing-routes";


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('trust proxy', true)
app.use(cookieParser());


app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/blogs', bloggersRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);
app.use('/email', emailRouter)
app.use('/testing', testingRouter)

const port = process.env.PORT || 4000

const start = async () => {
    // await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.pfyw1.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`)
    await runDb();
    app.listen(port, () => {
        console.log(`Server started on port ${port}`)
    })
}
start();