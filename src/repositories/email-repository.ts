import nodemailer from "nodemailer";

const subject = "Confirmation of registration"
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "yakovlevnode@gmail.com",
        pass: "xentulzzgvrotwrj",
    },
});

export const emailRepository = {
    async sendEmail(email: string | undefined, message: string) {
        try {
            const info = await transporter.sendMail({
                from: '"Egor Yakovlev 👻" <yakovlevnode@gmail.com>',
                to: email,
                subject: subject,
                text: message,
            });
            return (info.response).split(' ')[0]
        } catch (error) {
            console.log(error)
        }
    }
}