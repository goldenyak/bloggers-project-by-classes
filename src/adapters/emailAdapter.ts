import {emailRepository} from "../repositories/email-repository";

export const emailAdapter = {

    async sendEmail(email: string | undefined, message: string) {
        return await emailRepository.sendEmail(email, message)
    }
}