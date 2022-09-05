import jwt from "jsonwebtoken";

export const generateAccessToken = (_id: string) => {
    const token =  jwt.sign({userId: _id}, "fhdgsmmbxssnxmsnxa", {expiresIn: "1h"})
    return token
}