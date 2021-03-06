import express from "express";
import jwt from "jsonwebtoken";
import {userModel} from "../../../database/models/user";
import bcrypt from "bcrypt";

export default function auth_route(){
    let router = express.Router();

    router.post("/auth", (req, res, next) => {
        const {email, password} = req.body;
        userModel.findOne({email: email}).select('+password').exec().then(user =>{
            if(!user)
                return res.status(401).send("User not found");
            if(!user.isEmailVerified)
                return res.status(401).send("User not verified");

            bcrypt.compare(password, <string>user.password, (err, match) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Error while verifying credentials");
                }

                if (match) {
                    // TODO: Secret!
                    delete user.password;
                    const token = jwt.sign(
                        {id: user._id, email: user.email},
                        "SECRET",
                        { expiresIn: '20h' });

                    return res.status(200).json({
                        msg: "Login success",
                        user,
                        jwt: token
                    })
                } else {
                    return res.status(401).json({ msg: "Wrong password" })
                }
            })
        })
    })

    return router;
}