import {Request, Response, Router} from "express";
import {emailAdapter} from "../adapters/emailAdapter";

export const emailRouter = Router({});

emailRouter.post('/send',
    async (req: Request, res: Response) => {

        await emailAdapter.sendEmail(req.body.email, req.body.subject)

        res.status(200).json({
            "email": req.body.email,
            "message": req.body.subject,
            "subject": req.body.message
        })
    });